import { Injectable } from "@angular/core";
import { type ApiRequest, type ApiRequestInterceptor, RequestInterceptorException } from "@sca-frontend/api";
import { StorageService } from "@sca-frontend/storage";
import { RefreshTokenStorageKey } from "../const";

@Injectable()
export class RefreshTokenInterceptor<TRequest> implements ApiRequestInterceptor<TRequest> {
	public constructor(
		// Dependencies

		private readonly storageService: StorageService,
	) {}

	public async intercept(apiRequest: ApiRequest<TRequest>): Promise<ApiRequest<TRequest>> {
		const refreshToken = this.storageService.getItem(RefreshTokenStorageKey);

		if (refreshToken) {
			if (!apiRequest.headers) apiRequest.headers = {};

			apiRequest.headers["refresh-token"] = refreshToken;

			return apiRequest;
		}

		throw new Error("Refresh token is unavailable in store");
	}

	public async handleInterceptionException(error: any): Promise<RequestInterceptorException> {
		throw new RequestInterceptorException({ error: "Failed to add refresh token in header", message: error });
	}
}
