import type { Transaction } from "sequelize";

export interface TransactionStore {
	transaction: Transaction;
}

export interface RunningTransaction {
	currentTransaction: TransactionStore;
	createdOnThisLevel: boolean;
}

export type TransactionCallback<T> = (runningTransaction: RunningTransaction) => Promise<T>;

export type TransactionError = (error: any) => Promise<void>;

export interface TransactionalOperation<TransactionReturn> {
	withTransaction?: RunningTransaction;
	transactionCallback: TransactionCallback<TransactionReturn>;
	failureCallback?: TransactionError;
}
