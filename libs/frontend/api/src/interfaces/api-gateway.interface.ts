import type { IException, ISuccessfulResponse, IUnsuccessfulResponse } from "@sca-shared/dto";
import type { AxiosRequestConfig, AxiosResponse } from "axios";

export type DataStream<TRequest, TResponse, TException> = ApiRequest<TRequest> | ApiResponse<TRequest, TResponse, TException>;

export type ApiRequest<TRequest> = AxiosRequestConfig<TRequest>;

export type ApiResponse<TRequest, TResponse, TException> = SuccessfulResponse<TRequest, TResponse> | UnSuccessfulResponse<TRequest, TException>;

export type SuccessfulResponse<TRequest, TResponse> = AxiosResponse<ISuccessfulResponse<TResponse>, TRequest>;

export type UnSuccessfulResponse<TRequest, TException> = AxiosResponse<IUnsuccessfulResponse<TException>, TRequest>;

export type ResponseReturn<TResponse, TException> = SuccessfulResponseReturn<TResponse> | UnSuccessfulResponseReturn<TException>;

export type SuccessfulResponseReturn<TResponse> = { successful: true; response: TResponse };

export type UnSuccessfulResponseReturn<TException> = { successful: false; response: IException<TException> };
