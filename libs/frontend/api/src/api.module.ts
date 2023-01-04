import { Inject, InjectionToken, type ModuleWithProviders, NgModule, Optional, Self } from "@angular/core";
import type { IRawApiRoute } from "./interfaces";
import { ApiRouteLoaderService, ApiRouteService } from "./services";

export const ROUTES = new InjectionToken<Array<IRawApiRoute>>("routes");

@NgModule({
	providers: [ApiRouteService, ApiRouteLoaderService],
})
export class ApiModule {
	public constructor(
		// Dependencies

		private apiRouteService: ApiRouteService,
		private apiRouteLoaderService: ApiRouteLoaderService,
		@Inject(ROUTES) @Self() @Optional() private routes?: Array<IRawApiRoute>,
	) {
		if (routes) {
			const parsedApiRoutes = this.apiRouteLoaderService.loadRoutes(routes);
			this.apiRouteService.registerRoutes(parsedApiRoutes);
		}
	}

	public static forFeature(routes: Array<IRawApiRoute>): ModuleWithProviders<ApiModule> {
		return {
			ngModule: ApiModule,
			providers: [
				{
					provide: ROUTES,
					useValue: routes,
				},
			],
		};
	}
}
