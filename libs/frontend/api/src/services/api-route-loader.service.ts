import { Injectable } from "@angular/core";
import type { Optional } from "@sca-shared/utils";
import type { IApiRoute, IRawApiRoute } from "../interfaces";

@Injectable()
export class ApiRouteLoaderService {
	private parsedRoutes: Array<IApiRoute> = [];

	public loadRoutes(routes: Array<IRawApiRoute>): Array<IApiRoute> {
		this.loadRawRoutes(routes);

		return this.flushAndReturnParsedRoutes();
	}

	private loadRawRoutes(routes: Array<IRawApiRoute>): void;
	private loadRawRoutes(routes: Array<IRawApiRoute>, prefix: string): void;
	private loadRawRoutes(routes: Array<IRawApiRoute>, prefix?: string): void {
		routes.forEach((route: IRawApiRoute) => {
			if ("prefix" in route) {
				const preparedPrefix = this.prepareRouteSegments(prefix, route.prefix);

				this.loadRawRoutes(<Array<IRawApiRoute>>route.routes, preparedPrefix);

				return;
			}

			const preparedRoute: IApiRoute = { ...route };
			preparedRoute.route = this.prepareRouteSegments(prefix, route.route);

			this.parsedRoutes.push(preparedRoute);
		});
	}

	private flushAndReturnParsedRoutes(): Array<IApiRoute> {
		const parsedRoutes = this.parsedRoutes;
		this.parsedRoutes = [];

		return parsedRoutes;
	}

	private prepareRouteSegments(...prefixes: Array<Optional<string>>): string {
		return prefixes.reduce((prefixAccumulator: string, prefix: Optional<string>) => {
			if (!prefix) return prefixAccumulator;

			const parsedPrefix = this.parseRouteSegment(prefix);

			return `${prefixAccumulator}/${parsedPrefix}`;
		}, "");
	}

	private parseRouteSegment(prefix: string): string {
		while (prefix.startsWith("/")) prefix = prefix.slice(1);

		while (prefix.endsWith("/")) prefix = prefix.slice(0, prefix.length - 1);

		return prefix;
	}
}
