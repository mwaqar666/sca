import { RequestInterceptorException } from "../../exceptions";
import type { ApiRequest, GlobalApiRequestInterceptor } from "../../interfaces";

export class FirstLevelRequestInterceptor implements GlobalApiRequestInterceptor {
	public async intercept(apiRequest: ApiRequest<any>): Promise<ApiRequest<any>> {
		console.log("FirstLevelRequestInterceptor");
		return apiRequest;
	}

	public async handleInterceptionException(error: any): Promise<RequestInterceptorException> {
		throw new RequestInterceptorException(error);
	}
}
