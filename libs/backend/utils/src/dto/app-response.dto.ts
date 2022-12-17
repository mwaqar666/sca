import { ISuccessfulResponse } from "@sca-shared/dto";

export class AppSuccessfulResponseDto<TResponse> implements ISuccessfulResponse<TResponse> {
	public data: TResponse;
	public error: null;
}
