import { Injectable } from "@angular/core";
import { Action, Selector, State, StateContext, StateToken } from "@ngxs/store";
import { SetRouteDataAction } from "../actions";
import { DefaultRouteData, RouteData } from "../models";

export const RouteDataStateToken = new StateToken<RouteData>("routeDataState");

@State({
	name: RouteDataStateToken,
	defaults: DefaultRouteData,
})
@Injectable()
export class RouteDataState {
	@Selector()
	public static getRouteData(state: RouteData) {
		return state;
	}

	@Action(SetRouteDataAction)
	public setRouteData(context: StateContext<RouteData>, payload: SetRouteDataAction) {
		context.setState(payload.data);
	}
}
