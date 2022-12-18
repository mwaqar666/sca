import { ConfigService } from "@sca-frontend/config";
import type { IUnsuccessfulResponse } from "@sca-shared/dto";
import type { Constructable } from "@sca-shared/utils";
import type { Axios, AxiosError, Method, RawAxiosRequestHeaders } from "axios";
import axios from "axios";
import type {
	ApiRequest,
	ApiRequestInterceptor,
	ApiResponseInterceptor,
	BaseApiInterceptor,
	GlobalApiRequestInterceptor,
	GlobalApiResponseInterceptor,
	InterceptionCycle,
	IProcessedApiRoute,
	ResponseReturn,
	SuccessfulResponse,
	UnSuccessfulResponse,
} from "../interfaces";

export abstract class ApiService<TApiGateway extends ApiService<TApiGateway, TRequest, TResponse, TException>, TRequest, TResponse, TException = unknown> {
	protected apiRequest: ApiRequest<TRequest>;
	protected apiSuccessfulResponse: SuccessfulResponse<TRequest, TResponse>;
	protected apiUnsuccessfulResponse: UnSuccessfulResponse<TRequest, TException>;

	protected requestInterceptors: Array<Constructable<ApiRequestInterceptor<TRequest>>> = [];
	protected responseInterceptors: Array<Constructable<ApiResponseInterceptor<TRequest, TResponse>>> = [];

	private axiosInstance: Axios;

	private firstLevelGlobalRequestInterceptors: Array<Constructable<GlobalApiRequestInterceptor>> = [];
	private lastLevelGlobalRequestInterceptors: Array<Constructable<GlobalApiRequestInterceptor>> = [];

	private firstLevelGlobalResponseInterceptors: Array<Constructable<GlobalApiResponseInterceptor>> = [];
	private lastLevelGlobalResponseInterceptors: Array<Constructable<GlobalApiResponseInterceptor>> = [];

	protected constructor(
		// Dependencies

		private readonly configService: ConfigService,
	) {}

	public abstract execute(this: TApiGateway, routeModel: IProcessedApiRoute<TRequest>): Promise<ResponseReturn<TResponse, TException>>;

	protected async sendRequest(this: TApiGateway): Promise<ResponseReturn<TResponse, TException>> {
		this.ensureInstancePresenceBeforeRequestExecution();

		try {
			this.apiSuccessfulResponse = await this.axiosInstance.request<TResponse, SuccessfulResponse<TRequest, TResponse>, TRequest>(this.apiRequest);

			return { successful: true, response: this.apiSuccessfulResponse.data.data };
		} catch (error) {
			const apiException = error as AxiosError<IUnsuccessfulResponse<TException>, TRequest>;

			this.apiUnsuccessfulResponse = <UnSuccessfulResponse<TRequest, TException>>apiException.response;

			return { successful: false, response: this.apiUnsuccessfulResponse.data.error };
		}
	}

	protected prepare(this: TApiGateway, apiRoute: IProcessedApiRoute<TRequest>): TApiGateway {
		this.apiRequest = { timeout: 600000, baseURL: this.prepareBaseUrl() };
		this.axiosInstance = axios.create(this.apiRequest);

		this.setRequestUrl(apiRoute.route).setMethod(apiRoute.method).setHeaders(apiRoute.headers).setRequestData(apiRoute.data).attachInterceptors();

		return this;
	}

	private setRequestData(this: TApiGateway, requestModel?: TRequest): TApiGateway {
		this.ensureInstancePresenceBeforeRequestExecution();

		this.apiRequest.data = requestModel;

		return this;
	}

	private setMethod(this: TApiGateway, method: Method): TApiGateway {
		this.ensureInstancePresenceBeforeRequestExecution();

		this.apiRequest.method = method;

		return this;
	}

	private setHeaders(this: TApiGateway, headers: RawAxiosRequestHeaders): TApiGateway {
		this.ensureInstancePresenceBeforeRequestExecution();

		this.axiosInstance.defaults.headers.common = { ...this.axiosInstance.defaults.headers.common, ...headers };

		return this;
	}

	private setRequestUrl(this: TApiGateway, requestUrl: string): TApiGateway {
		this.apiRequest.url = requestUrl;

		return this;
	}

	private prepareBaseUrl(this: TApiGateway): string {
		const apiConfig = this.configService.get("api");

		return `${apiConfig.protocol}://${apiConfig.baseUrl}`;
	}

	private ensureInstancePresenceBeforeRequestExecution(this: TApiGateway): void {
		if (!this.axiosInstance) throw new Error("Axios instance not created yet. Call init() method before calling any other method on the gateway instance.");

		if (!this.apiRequest) throw new Error("Api Request not initialized. Call init() method before calling any other method on the gateway instance.");
	}

	private attachInterceptors(this: TApiGateway): void {
		/**
		 * Request Interceptors
		 * ====================
		 * Order of execution:
		 * 1. FirstLevelGlobalRequestInterceptors
		 * 2. GatewaySpecificRequestInterceptors
		 * 3. LastLevelGlobalRequestInterceptors
		 */

		this.attachInterceptor({ cycle: "request", interceptors: this.lastLevelGlobalRequestInterceptors.reverse() });

		this.attachInterceptor({ cycle: "request", interceptors: this.requestInterceptors.reverse() });

		this.attachInterceptor({ cycle: "request", interceptors: this.firstLevelGlobalRequestInterceptors.reverse() });

		/**
		 * Response Interceptors
		 * ====================
		 * Order of execution:
		 * 1. FirstLevelGlobalResponseInterceptors
		 * 2. GatewaySpecificResponseInterceptors
		 * 3. LastLevelGlobalResponseInterceptors
		 */
		this.attachInterceptor({ cycle: "response", interceptors: this.firstLevelGlobalResponseInterceptors });

		this.attachInterceptor({ cycle: "response", interceptors: this.responseInterceptors });

		this.attachInterceptor({ cycle: "response", interceptors: this.lastLevelGlobalResponseInterceptors });
	}

	private attachInterceptor(this: TApiGateway, interceptionCycle: InterceptionCycle): void {
		interceptionCycle.interceptors.forEach((concreteInterceptor: Constructable<BaseApiInterceptor<any>>) => {
			const interceptorInstance = new concreteInterceptor();

			this.axiosInstance.interceptors[interceptionCycle.cycle].use(interceptorInstance.intercept, interceptorInstance.handleInterceptionException);
		});
	}
}
