import { RouteData } from "../models";

export class SetRouteDataAction {
	public static readonly type = "[RouteData] SetRouteDataAction";

	public constructor(public readonly data: RouteData) {}
}
