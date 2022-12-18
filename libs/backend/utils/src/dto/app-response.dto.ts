import { ISuccessfulResponse, IUnsuccessfulResponse } from "@sca-shared/dto";
import { AppExceptionDto } from "./app-exception.dto";

export class AppSuccessfulResponseDto<TResponse> implements ISuccessfulResponse<TResponse> {
	public data: TResponse;
	public error: null;
}

export class AppUnsuccessfulResponseDto<TException = unknown> implements IUnsuccessfulResponse<TException> {
	public data: null;
	public error: AppExceptionDto<TException>;
}
