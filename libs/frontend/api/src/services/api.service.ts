import type { Constructable } from "@sca-shared/utils";
import axios, { Axios, AxiosError, Method, RawAxiosRequestHeaders } from "axios";
import type {
	ApiRequest,
	ApiRequestInterceptor,
	ApiResponse,
	ApiResponseInterceptor,
	BaseApiInterceptor,
	DataStream,
	GlobalApiRequestInterceptor,
	GlobalApiResponseInterceptor,
	GlobalStreamInterceptionCycle,
	IApiGateway,
	IProcessedApiRoute,
	ResponseReturn,
	StreamInterceptionCycle,
	SuccessfulResponse,
	UnSuccessfulResponse,
} from "../interfaces";

export abstract class ApiService<TApiGateway extends ApiService<TApiGateway, TRequest, TResponse, TException>, TRequest, TResponse, TException>
	implements IApiGateway<TApiGateway, TRequest, TResponse, TException>
{
	// Api Life Cycle Streams - (Request / Response)
	protected apiRequest: ApiRequest<TRequest>;
	protected apiResponse: ApiResponse<TRequest, TResponse, TException>;

	// Gateway Specific Stream Interceptors (Request / Response)
	protected requestInterceptors: Array<Constructable<ApiRequestInterceptor<TRequest>>> = [];
	protected responseInterceptors: Array<Constructable<ApiResponseInterceptor<TRequest, TResponse>>> = [];

	// Axios Instance
	private axiosInstance: Axios;

	// Global Stream Interceptors (Request / Response)
	private firstLevelGlobalRequestInterceptors: Array<Constructable<GlobalApiRequestInterceptor>> = [];
	private lastLevelGlobalRequestInterceptors: Array<Constructable<GlobalApiRequestInterceptor>> = [];

	private firstLevelGlobalResponseInterceptors: Array<Constructable<GlobalApiResponseInterceptor>> = [];
	private lastLevelGlobalResponseInterceptors: Array<Constructable<GlobalApiResponseInterceptor>> = [];

	public abstract execute(this: TApiGateway, routeModel: IProcessedApiRoute<TRequest>): Promise<ResponseReturn<TRequest, TResponse, TException>>;

	public setRequestModel(this: TApiGateway, requestModel?: TRequest): TApiGateway {
		this.ensureInstancePresenceBeforeRequestExecution();

		this.apiRequest.data = requestModel;

		return this;
	}

	public setMethod(this: TApiGateway, method: Method): TApiGateway {
		this.ensureInstancePresenceBeforeRequestExecution();

		this.apiRequest.method = method;

		return this;
	}

	public setHeaders(this: TApiGateway, headers: RawAxiosRequestHeaders): TApiGateway {
		this.ensureInstancePresenceBeforeRequestExecution();

		this.axiosInstance.defaults.headers.common = { ...this.axiosInstance.defaults.headers.common, ...headers };

		return this;
	}

	public setRequestUrl(this: TApiGateway, requestUrl: string): TApiGateway {
		this.apiRequest.url = requestUrl;

		return this;
	}

	public async sendRequest(this: TApiGateway): Promise<ResponseReturn<TRequest, TResponse, TException>> {
		this.ensureInstancePresenceBeforeRequestExecution();

		try {
			this.apiResponse = await this.axiosInstance.request<TResponse, SuccessfulResponse<TRequest, TResponse>, TRequest>(this.apiRequest);

			return { successful: true, response: this.apiResponse };
		} catch (error) {
			const apiException = error as AxiosError<TException, TRequest>;

			this.apiResponse = apiException.response as UnSuccessfulResponse<TRequest, TException>;

			return { successful: false, response: this.apiResponse };
		}
	}

	protected init(this: TApiGateway, apiRoute: IProcessedApiRoute<TRequest>): TApiGateway {
		// noinspection HttpUrlsUsage
		this.apiRequest = { timeout: 600000, baseURL: `http://node.test` };
		this.axiosInstance = axios.create(this.apiRequest);

		this.setRequestUrl(apiRoute.routeUrl).setMethod(apiRoute.method).setHeaders(apiRoute.headers).setRequestModel(apiRoute.requestModel).attachInterceptors();

		return this;
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

		this.attachInterceptor({ cycle: "request", interceptors: this.lastLevelGlobalRequestInterceptors.reverse(), dataStream: this.apiRequest });

		this.attachInterceptor({ cycle: "request", interceptors: this.requestInterceptors.reverse(), dataStream: this.apiRequest });

		this.attachInterceptor({ cycle: "request", interceptors: this.firstLevelGlobalRequestInterceptors.reverse(), dataStream: this.apiRequest });

		/**
		 * Response Interceptors
		 * ====================
		 * Order of execution:
		 * 1. FirstLevelGlobalResponseInterceptors
		 * 2. GatewaySpecificResponseInterceptors
		 * 3. LastLevelGlobalResponseInterceptors
		 */
		this.attachInterceptor({ cycle: "response", interceptors: this.firstLevelGlobalResponseInterceptors, dataStream: this.apiResponse });

		this.attachInterceptor({ cycle: "response", interceptors: this.responseInterceptors, dataStream: this.apiResponse });

		this.attachInterceptor({ cycle: "response", interceptors: this.lastLevelGlobalResponseInterceptors, dataStream: this.apiResponse });
	}

	private attachInterceptor(this: TApiGateway, streamInterceptionCycle: StreamInterceptionCycle<TRequest, TResponse, TException> | GlobalStreamInterceptionCycle): void {
		streamInterceptionCycle.interceptors.forEach((streamCycleInterceptor: Constructable<BaseApiInterceptor<DataStream<TRequest, TResponse, TException>>>) => {
			const interceptorInstance: BaseApiInterceptor<DataStream<TRequest, TResponse, TException>> = new streamCycleInterceptor();

			this.axiosInstance.interceptors[streamInterceptionCycle.cycle].use(interceptorInstance.intercept as any, interceptorInstance.handleInterceptionException);
		});
	}
}
