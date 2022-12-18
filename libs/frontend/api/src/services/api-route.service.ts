import { Injectable } from "@angular/core";
import type { Nullable } from "@sca-shared/utils";
import type { RawAxiosRequestHeaders } from "axios";
import { InvalidQueryParameterError, InvalidRouteParameterError, NotProvidedRouteParameterError, RouteNotFoundError } from "../const";
import type { IApiRoute, IProcessedApiRoute, IRawApiRoute } from "../interfaces";
import { ApiRouteLoaderService } from "./api-route-loader.service";

@Injectable()
export class ApiRouteService {
	private apiRoutes: Array<IApiRoute> = [];
	private currentRoute: Nullable<IApiRoute>;
	private currentProcessedRoute: Nullable<IProcessedApiRoute<any>>;

	public constructor(
		// Dependencies

		private readonly apiRouteLoaderService: ApiRouteLoaderService,
	) {}

	public loadRoutes(routes: Array<IRawApiRoute>): void {
		const loadedRoutes = this.apiRouteLoaderService.loadRoutes(routes);

		this.apiRoutes.push(...loadedRoutes);
	}

	public getProcessedRoute<T = any>(): IProcessedApiRoute<T> {
		if (!this.currentProcessedRoute || !this.currentRoute) throw new Error(RouteNotFoundError);

		const routeToReturn = this.currentProcessedRoute;

		this.setInitialProcessedRoute();

		return routeToReturn;
	}

	public findRoute(routeName: string): ApiRouteService {
		this.clearPreviousRouteCache();

		const apiRoute = this.apiRoutes.find((apiRoute: IApiRoute) => apiRoute.name === routeName);

		if (!apiRoute) throw new Error(RouteNotFoundError);

		this.currentRoute = { ...apiRoute };

		this.setInitialProcessedRoute();
		return this;
	}

	public withRouteParams(providedRouteParams: Record<string, string | number>): ApiRouteService {
		if (!this.currentRoute || !this.currentProcessedRoute) throw new Error(RouteNotFoundError);

		const routeObject = this.currentProcessedRoute;

		this.currentRoute.routeParams.forEach((routeParam: string): void => {
			if (providedRouteParams[routeParam] === undefined || providedRouteParams[routeParam] === null) throw new Error(NotProvidedRouteParameterError);

			routeObject.route = routeObject.route.replace(`{${routeParam}}`, String(providedRouteParams[routeParam]));

			delete providedRouteParams[routeParam];
		});

		if (Object.keys(providedRouteParams).length > 0) throw new Error(InvalidRouteParameterError);

		this.currentProcessedRoute = routeObject;

		return this;
	}

	public withQueryParams(providedQueryParams: Record<string, string | number | boolean>): ApiRouteService {
		if (!this.currentRoute || !this.currentProcessedRoute) throw new Error(RouteNotFoundError);

		const routeObject = this.currentProcessedRoute;

		this.currentRoute.queryParams.forEach((queryParam: string, currentIndex: number): void => {
			if (providedQueryParams[queryParam] === undefined) return;

			routeObject.route = `${routeObject.route}${currentIndex === 0 ? "?" : "&"}${queryParam}=${String(providedQueryParams[queryParam])}`;

			delete providedQueryParams[queryParam];
		});

		if (Object.keys(providedQueryParams).length > 0) throw new Error(InvalidQueryParameterError);

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
		currentProcessedRoute.data = requestModel;

		this.currentProcessedRoute = currentProcessedRoute;

		return this;
	}

	private clearPreviousRouteCache(): void {
		this.currentRoute = null;
		this.currentProcessedRoute = null;
	}

	private setInitialProcessedRoute(): void {
		const currentRoute = this.getCurrentRouteOrThrow();

		this.currentProcessedRoute = { route: currentRoute.route, headers: {}, method: currentRoute.method };
	}

	private getCurrentRouteOrThrow(): IApiRoute {
		if (!this.currentRoute) throw new Error(RouteNotFoundError);

		return this.currentRoute;
	}

	private getCurrentProcessedRouteOrThrow<T>(): IProcessedApiRoute<T> {
		if (!this.currentProcessedRoute) throw new Error(RouteNotFoundError);

		return this.currentProcessedRoute;
	}
}
