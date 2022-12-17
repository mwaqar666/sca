import { Injectable } from "@angular/core";
import { type ApiRequest, type ApiRequestInterceptor, RequestInterceptorException } from "@sca-frontend/api";
import { StorageService } from "@sca-frontend/storage";
import { AccessTokenStorageKey } from "../const";

@Injectable()
export class AccessTokenInterceptor<TRequest> implements ApiRequestInterceptor<TRequest> {
	public constructor(
		// Dependencies

		private readonly storageService: StorageService,
	) {}

	public async intercept(apiRequest: ApiRequest<TRequest>): Promise<ApiRequest<TRequest>> {
		const accessToken = this.storageService.getItem(AccessTokenStorageKey);

		if (accessToken) {
			if (!apiRequest.headers) apiRequest.headers = {};

			apiRequest.headers["authorization"] = `Bearer ${accessToken}`;

			return apiRequest;
		}

		throw new Error("Access token unavailable in store");
	}

	public async handleInterceptionException(error: any): Promise<RequestInterceptorException> {
		throw new RequestInterceptorException({ error: "Failed to add access token in header", message: error });
	}
}
