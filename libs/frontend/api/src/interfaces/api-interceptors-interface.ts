import type { IException } from "@sca-shared/dto";
import type { Constructable } from "@sca-shared/utils";
import type { RequestInterceptorException, ResponseInterceptorException } from "../exceptions";
import type { ApiRequest, SuccessfulResponse } from "./api-gateway.interface";

export type InterceptionException = Omit<IException, "statusCode">;

export interface BaseApiInterceptor<DataStream> {
	intercept(dataStream: DataStream): Promise<DataStream>;

	handleInterceptionException(error: any): Promise<any>;
}

export interface ApiRequestInterceptor<TRequest> extends BaseApiInterceptor<ApiRequest<TRequest>> {
	intercept(apiRequest: ApiRequest<TRequest>): Promise<ApiRequest<TRequest>>;

	handleInterceptionException(error: any): Promise<RequestInterceptorException>;
}

export interface ApiResponseInterceptor<TRequest, TResponse> extends BaseApiInterceptor<SuccessfulResponse<TRequest, TResponse>> {
	intercept(apiResponse: SuccessfulResponse<TRequest, TResponse>): Promise<SuccessfulResponse<TRequest, TResponse>>;

	handleInterceptionException(error: any): Promise<ResponseInterceptorException>;
}

export interface GlobalApiRequestInterceptor extends BaseApiInterceptor<ApiRequest<any>> {
	intercept(apiRequest: ApiRequest<any>): Promise<ApiRequest<any>>;

	handleInterceptionException(error: any): Promise<RequestInterceptorException>;
}

export interface GlobalApiResponseInterceptor extends BaseApiInterceptor<SuccessfulResponse<any, any>> {
	intercept(apiResponse: SuccessfulResponse<any, any>): Promise<SuccessfulResponse<any, any>>;

	handleInterceptionException(error: any): Promise<ResponseInterceptorException>;
}

export interface SpecificRequestInterceptionCycle<TRequest> {
	cycle: "request";
	interceptors: Array<Constructable<ApiRequestInterceptor<TRequest>>>;
}

export interface SpecificResponseInterceptionCycle<TRequest, TResponse> {
	cycle: "response";
	interceptors: Array<Constructable<ApiResponseInterceptor<TRequest, TResponse>>>;
}

export interface GlobalRequestInterceptionCycle {
	cycle: "request";
	interceptors: Array<Constructable<GlobalApiRequestInterceptor>>;
}

export interface GlobalResponseInterceptionCycle {
	cycle: "response";
	interceptors: Array<Constructable<GlobalApiResponseInterceptor>>;
}

export type SpecificInterceptionCycle<TRequest, TResponse> = SpecificRequestInterceptionCycle<TRequest> | SpecificResponseInterceptionCycle<TRequest, TResponse>;

export type GlobalInterceptionCycle = GlobalRequestInterceptionCycle | GlobalResponseInterceptionCycle;

export type InterceptionCycle = SpecificInterceptionCycle<any, any> | GlobalInterceptionCycle;
