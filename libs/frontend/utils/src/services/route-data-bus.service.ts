import { Injectable } from "@angular/core";
import type { ActivatedRoute } from "@angular/router";
import { Store } from "@ngxs/store";
import { type Observable, take } from "rxjs";
import { type RouteData, RouteDataStateToken, SetRouteDataAction } from "../store";

@Injectable()
export class RouteDataBusService {
	public constructor(
		// Dependencies

		private store: Store,
	) {}

	public useRoute(activatedRoute: ActivatedRoute): void {
		const routeData: Observable<RouteData> = activatedRoute.data as Observable<RouteData>;

		routeData.pipe(take(1)).subscribe((data: RouteData) => {
			this.store.dispatch(new SetRouteDataAction(data));
		});
	}

	public getRoute(): Observable<RouteData> {
		return this.store.select(RouteDataStateToken);
	}
}
