import type { IException } from "@sca-shared/dto";
import type { AxiosRequestConfig, AxiosResponse, Method } from "axios";

// Data Stream — Combination of ApiRequest<TRequest, TResponse> & ApiResponse<TRequest, TResponse, TException>
export type DataStream<TRequest, TResponse, TException> = ApiRequest<TRequest> | ApiResponse<TRequest, TResponse, TException>;

// Api Request Type
export type ApiRequest<TRequest> = AxiosRequestConfig<TRequest>;

// Api Response Type
export type ApiResponse<TRequest, TResponse, TException> = SuccessfulResponse<TRequest, TResponse> | UnSuccessfulResponse<TRequest, TException>;

// Successful Api Response Type
export type SuccessfulResponse<TRequest, TResponse> = AxiosResponse<TResponse, TRequest>;

// UnSuccessful Api Response Type
export type UnSuccessfulResponse<TRequest, TException = IException> = AxiosResponse<TException, TRequest>;

// Return type for Api response
export type ResponseReturn<TRequest, TResponse, TException = IException> = SuccessfulResponseReturn<TRequest, TResponse> | UnSuccessfulResponseReturn<TRequest, TException>;

// Return type for successful Api response
export type SuccessfulResponseReturn<TRequest, TResponse> = { successful: true; response: SuccessfulResponse<TRequest, TResponse> };

// Return type for un-successful Api response
export type UnSuccessfulResponseReturn<TRequest, TException = IException> = { successful: false; response: UnSuccessfulResponse<TRequest, TException> };

// Main Api Gateway Interface
export interface IApiGateway<TApiGateway, TRequest, TResponse, TException = IException> {
	setRequestModel(requestModel: TRequest): TApiGateway;

	setMethod(method: Method): TApiGateway;

	setHeaders(headers: Record<string, string | number | boolean>): TApiGateway;

	setRequestUrl(requestUrl: string): TApiGateway;

	sendRequest(): Promise<ResponseReturn<TRequest, TResponse, TException>>;
}
