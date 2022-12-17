import type { IException } from "@sca-shared/dto";
import type { Constructable } from "@sca-shared/utils";
import type { RequestInterceptorException, ResponseInterceptorException } from "../exceptions";
import type { ApiRequest, ApiResponse } from "./api-gateway.interface";

export type InterceptionException = Omit<IException, "statusCode">;

// Base Interceptor
export interface BaseApiInterceptor<DataStream> {
	intercept(dataStream: DataStream): Promise<DataStream>;

	handleInterceptionException(error: any): Promise<any>;
}

// Gateway Specific Request Interceptor
export interface ApiRequestInterceptor<TRequest> extends BaseApiInterceptor<ApiRequest<TRequest>> {
	intercept(apiRequest: ApiRequest<TRequest>): Promise<ApiRequest<TRequest>>;

	handleInterceptionException(error: any): Promise<RequestInterceptorException>;
}

// Gateway Specific Response Interceptor
export interface ApiResponseInterceptor<TRequest, TResponse, TException = any> extends BaseApiInterceptor<ApiResponse<TRequest, TResponse, TException>> {
	intercept(apiResponse: ApiResponse<TRequest, TResponse, TException>): Promise<ApiResponse<TRequest, TResponse, TException>>;

	handleInterceptionException(error: any): Promise<ResponseInterceptorException>;
}

// Gateway Specific Request Interceptor Stream
export interface RequestStreamInterceptionCycle<TRequest> {
	cycle: "request";
	dataStream: ApiRequest<TRequest>;
	interceptors: Array<Constructable<ApiRequestInterceptor<TRequest>>>;
}

// Gateway Specific Response Interceptor Stream
export interface ResponseStreamInterceptionCycle<TRequest, TResponse, TException> {
	cycle: "response";
	dataStream: ApiResponse<TRequest, TResponse, TException>;
	interceptors: Array<Constructable<ApiResponseInterceptor<TRequest, TResponse, TException>>>;
}

// Gateway Specific Interceptor Stream
export type StreamInterceptionCycle<TRequest, TResponse, TException> = RequestStreamInterceptionCycle<TRequest> | ResponseStreamInterceptionCycle<TRequest, TResponse, TException>;

// Global Request Interceptor
export interface GlobalApiRequestInterceptor extends BaseApiInterceptor<ApiRequest<any>> {
	intercept(apiRequest: ApiRequest<any>): Promise<ApiRequest<any>>;

	handleInterceptionException(error: any): Promise<RequestInterceptorException>;
}

// Global Response Interceptor
export interface GlobalApiResponseInterceptor extends BaseApiInterceptor<ApiResponse<any, any, any>> {
	intercept(apiResponse: ApiResponse<any, any, any>): Promise<ApiResponse<any, any, any>>;

	handleInterceptionException(error: any): Promise<ResponseInterceptorException>;
}

// Global Request Interceptor Stream
export interface GlobalRequestStreamInterceptionCycle {
	cycle: "request";
	dataStream: ApiRequest<any>;
	interceptors: Array<Constructable<GlobalApiRequestInterceptor>>;
}

// Global Response Interceptor Stream
export interface GlobalResponseStreamInterceptionCycle {
	cycle: "response";
	dataStream: ApiResponse<any, any, any>;
	interceptors: Array<Constructable<GlobalApiResponseInterceptor>>;
}

// Global Interceptor Stream
export type GlobalStreamInterceptionCycle = GlobalRequestStreamInterceptionCycle | GlobalResponseStreamInterceptionCycle;
