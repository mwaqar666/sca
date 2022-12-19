import type { Route } from "@angular/router";
import { WithoutLayout } from "@sca-frontend/utils";
import { AuthPageComponent } from "../pages";

export const AuthPath = "auth";

export const AuthRoutes: Array<Route> = [
	{
		path: "",
		component: AuthPageComponent,
		data: WithoutLayout,
	},
];
