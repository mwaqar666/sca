import { IException } from "./exception.interface";

export interface ISuccessfulResponse<TResponse> {
	data: TResponse;
	error: null;
}

export interface IUnsuccessfulResponse {
	data: null;
	error: IException;
}
