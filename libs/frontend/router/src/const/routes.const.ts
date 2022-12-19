import type { Route } from "@angular/router";
import { AuthPath, GuestGuard } from "@sca-frontend/auth";

export const Routes: Array<Route> = [
	{
		path: "",
		pathMatch: "full",
		redirectTo: AuthPath,
	},
	{
		path: AuthPath,
		canActivate: [GuestGuard],
		loadChildren: () => import("@sca-frontend/auth").then(({ AuthModule }) => AuthModule),
	},
];
