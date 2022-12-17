import { ResponseInterceptorException } from "../../exceptions";
import type { ApiResponse, GlobalApiResponseInterceptor } from "../../interfaces";

export class FirstLevelResponseInterceptor implements GlobalApiResponseInterceptor {
	public async intercept(apiResponse: ApiResponse<any, any, any>): Promise<ApiResponse<any, any, any>> {
		console.log("First Level Response Interceptor");

		return apiResponse;
	}

	public async handleInterceptionException(error: any): Promise<ResponseInterceptorException> {
		throw new ResponseInterceptorException({ error: "First level response interceptor error", message: error });
	}
}
