import type { Method, RawAxiosRequestHeaders } from "axios";

export interface IApiRoute {
	route: string;
	method: Method;
	routeParams: string[];
	queryParams: string[];
	name: string;
}

export interface IPrefixApiRoute {
	prefix: string;
	routes: Array<IRawApiRoute>;
}

export type IRawApiRoute = IApiRoute | IPrefixApiRoute;

export interface IProcessedApiRoute<TRequest> {
	route: string;
	method: Method;
	headers: RawAxiosRequestHeaders;
	data?: TRequest;
}
