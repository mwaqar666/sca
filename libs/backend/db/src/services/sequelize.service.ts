import { HttpStatus, Injectable, InternalServerErrorException } from "@nestjs/common";
import type { AppExceptionDto } from "@sca-backend/utils";
import type { Transaction } from "sequelize";
import { BaseError } from "sequelize";
import { Sequelize } from "sequelize-typescript";
import type { RunningTransaction, TransactionalOperation, TransactionStore } from "../types";

@Injectable()
export class SequelizeService {
	public constructor(
		// Dependencies

		private readonly sequelizeInstance: Sequelize,
	) {}

	public async executeTransactionalOperation<T>(transactionalOperation: TransactionalOperation<T>): Promise<T> {
		const preparedTransaction = await this.prepareTransaction(transactionalOperation.withTransaction);

		try {
			const transactionResult = await transactionalOperation.transactionCallback(preparedTransaction);

			await this.wrapUpTransaction(preparedTransaction);

			return transactionResult;
		} catch (error) {
			if (error instanceof BaseError) await preparedTransaction.currentTransaction.transaction.rollback();

			if (transactionalOperation.failureCallback) await transactionalOperation.failureCallback(error);

			throw this.createInternalServerError(error);
		}
	}

	private async prepareTransaction(preparedTransaction?: RunningTransaction): Promise<RunningTransaction> {
		if (preparedTransaction) return { currentTransaction: preparedTransaction.currentTransaction, createdOnThisLevel: false };

		return { currentTransaction: await this.createNewTransaction(), createdOnThisLevel: true };
	}

	private async wrapUpTransaction(preparedTransaction: RunningTransaction): Promise<void> {
		if (!preparedTransaction.createdOnThisLevel) return;

		await preparedTransaction.currentTransaction.transaction.commit();
	}

	private createInternalServerError(error: unknown): InternalServerErrorException {
		if (error instanceof InternalServerErrorException) return error;

		const caughtException = error as Error;
		const httpErrorResponse: AppExceptionDto = { error: caughtException.message, message: caughtException.message, statusCode: HttpStatus.INTERNAL_SERVER_ERROR };
		return new InternalServerErrorException(httpErrorResponse);
	}

	private async createNewTransaction(): Promise<TransactionStore> {
		return { transaction: await this.createTransaction() };
	}

	private async createTransaction(): Promise<Transaction> {
		return await this.sequelizeInstance.transaction();
	}
}
