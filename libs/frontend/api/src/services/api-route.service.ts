import { Injectable } from "@angular/core";
import { Nullable } from "@sca-shared/utils";
import { RawAxiosRequestHeaders } from "axios";
import type { IApiRoute, IProcessedApiRoute, IRawApiRoute } from "../interfaces";
import { ApiRouteLoaderService } from "./api-route-loader.service";

@Injectable()
export class ApiRouteService {
	private apiRoutes: Array<IApiRoute> = [];
	private currentRoute: Nullable<IApiRoute>;
	private currentProcessedRoute: Nullable<IProcessedApiRoute<any>>;
	// Errors
	private errors = {
		notProvidedRouteParameterError: "A route parameter is not provided",
		invalidRouteParameterError: "Invalid route parameters are provided which are not defined in the API route object",
		invalidQueryParameterError: "Invalid query parameters are provided which are not defined in the API route object",
		routeNotFoundError: "API route not set. Either route with the mentioned name not available or the findRoute method not called!",
	};

	public constructor(
		// Dependencies

		private readonly apiRouteLoaderService: ApiRouteLoaderService,
	) {}

	public loadRoutes(routes: Array<IRawApiRoute>): void {
		const loadedRoutes = this.apiRouteLoaderService.loadRoutes(routes);

		this.apiRoutes.push(...loadedRoutes);
	}

	public getProcessedRoute<T = any>(): IProcessedApiRoute<T> {
		if (!this.currentProcessedRoute || !this.currentRoute) throw new Error(this.errors.routeNotFoundError);

		const routeToReturn = this.currentProcessedRoute;

		this.setInitialProcessedRoute();

		return routeToReturn;
	}

	public findRoute(routeName: string): ApiRouteService {
		this.clearPreviousRouteCache();

		const apiRoute = this.apiRoutes.find((apiRoute: IApiRoute) => apiRoute.name === routeName);

		if (!apiRoute) throw new Error(this.errors.routeNotFoundError);

		this.currentRoute = { ...apiRoute };

		this.setInitialProcessedRoute();
		return this;
	}

	public withRouteParams(providedRouteParams: Record<string, string | number>): ApiRouteService {
		if (!this.currentRoute || !this.currentProcessedRoute) throw new Error(this.errors.routeNotFoundError);

		const routeObject = this.currentProcessedRoute;

		this.currentRoute.routeParams.forEach((routeParam: string): void => {
			if (providedRouteParams[routeParam] === undefined || providedRouteParams[routeParam] === null) throw new Error(this.errors.notProvidedRouteParameterError);

			routeObject.routeUrl = routeObject.routeUrl.replace(`{${routeParam}}`, String(providedRouteParams[routeParam]));

			delete providedRouteParams[routeParam];
		});

		if (Object.keys(providedRouteParams).length > 0) throw new Error(this.errors.invalidRouteParameterError);

		this.currentProcessedRoute = routeObject;

		return this;
	}

	public withQueryParams(providedQueryParams: Record<string, string | number | boolean>): ApiRouteService {
		if (!this.currentRoute || !this.currentProcessedRoute) throw new Error(this.errors.routeNotFoundError);

		const routeObject = this.currentProcessedRoute;

		this.currentRoute.queryParams.forEach((queryParam: string, currentIndex: number): void => {
			if (providedQueryParams[queryParam] === undefined) return;

			routeObject.routeUrl = `${routeObject.routeUrl}${currentIndex === 0 ? "?" : "&"}${queryParam}=${String(providedQueryParams[queryParam])}`;

			delete providedQueryParams[queryParam];
		});

		if (Object.keys(providedQueryParams).length > 0) throw new Error(this.errors.invalidQueryParameterError);

		this.currentProcessedRoute = routeObject;

		return this;
	}

	public withHeaders(headers: RawAxiosRequestHeaders): ApiRouteService {
		const currentProcessedRoute = this.getCurrentProcessedRouteOrThrow();
		currentProcessedRoute.headers = headers;

		this.currentProcessedRoute = currentProcessedRoute;

		return this;
	}

	public withRequestModel<T>(requestModel: T): ApiRouteService {
		const currentProcessedRoute = this.getCurrentProcessedRouteOrThrow<T>();
		currentProcessedRoute.requestModel = requestModel;

		this.currentProcessedRoute = currentProcessedRoute;

		return this;
	}

	private clearPreviousRouteCache(): void {
		this.currentRoute = null;
		this.currentProcessedRoute = null;
	}

	private setInitialProcessedRoute(): void {
		const currentRoute = this.getCurrentRouteOrThrow();

		this.currentProcessedRoute = { routeUrl: currentRoute.route, headers: {}, method: currentRoute.method };
	}

	private getCurrentRouteOrThrow(): IApiRoute {
		if (!this.currentRoute) throw new Error(this.errors.routeNotFoundError);

		return this.currentRoute;
	}

	private getCurrentProcessedRouteOrThrow<T>(): IProcessedApiRoute<T> {
		if (!this.currentProcessedRoute) throw new Error(this.errors.routeNotFoundError);

		return this.currentProcessedRoute;
	}
}
