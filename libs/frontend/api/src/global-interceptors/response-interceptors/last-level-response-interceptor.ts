import { ResponseInterceptorException } from "../../exceptions";
import type { GlobalApiResponseInterceptor, SuccessfulResponse } from "../../interfaces";

export class LastLevelResponseInterceptor implements GlobalApiResponseInterceptor {
	public async intercept(apiResponse: SuccessfulResponse<any, any>): Promise<SuccessfulResponse<any, any>> {
		console.log("Last Level Response Interceptor");

		return apiResponse;
	}

	public async handleInterceptionException(error: any): Promise<ResponseInterceptorException> {
		return new ResponseInterceptorException({ error: "Last level response interceptor error", message: error });
	}
}
