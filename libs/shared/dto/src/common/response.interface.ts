import { IException } from "./exception.interface";

export interface ISuccessfulResponse<TResponse> {
	data: TResponse;
	error: null;
}

export interface IUnsuccessfulResponse<TException = unknown> {
	data: null;
	error: IException<TException>;
}
