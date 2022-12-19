import { Injectable } from "@angular/core";
import { Action, State, type StateContext, StateToken } from "@ngxs/store";
import { SetRouteDataAction } from "../actions";
import { DefaultRouteData, type RouteData } from "../models";

export const RouteDataStateToken = new StateToken<RouteData>("routeDataState");

@State({
	name: RouteDataStateToken,
	defaults: DefaultRouteData,
})
@Injectable()
export class RouteDataState {
	@Action(SetRouteDataAction)
	public setRouteData(context: StateContext<RouteData>, payload: SetRouteDataAction) {
		context.setState(payload.data);
	}
}
