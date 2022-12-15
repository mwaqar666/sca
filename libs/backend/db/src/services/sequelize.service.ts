import { Injectable } from "@nestjs/common";
import type { Transaction } from "sequelize";
import { Sequelize } from "sequelize-typescript";
import type { RunningTransaction, TransactionalOperation, TransactionStore } from "../types";

@Injectable()
export class SequelizeService {
	public constructor(
		// Dependencies

		private readonly sequelizeInstance: Sequelize,
	) {}

	public async executeTransactionalOperation<T, R = void>(transactionalOperation: TransactionalOperation<T, R>): Promise<T | R> {
		const preparedTransaction = await this.prepareTransaction(transactionalOperation.withTransaction);

		try {
			const transactionResult = await transactionalOperation.transactionCallback(preparedTransaction);

			await this.wrapUpTransaction(preparedTransaction);

			return transactionResult;
		} catch (error) {
			await preparedTransaction.currentTransaction.transaction.rollback();

			if (error && transactionalOperation.failureCallback) return await transactionalOperation.failureCallback(error);

			throw new Error();
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

	private async createNewTransaction(): Promise<TransactionStore> {
		return { transaction: await this.createTransaction() };
	}

	private async createTransaction(): Promise<Transaction> {
		return await this.sequelizeInstance.transaction();
	}
}
