export interface IException<TException = unknown> {
	error: string;
	message: TException;
	statusCode: number;
}
