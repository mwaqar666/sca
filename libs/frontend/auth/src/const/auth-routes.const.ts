import type { Route } from "@angular/router";
import { WithoutLayout } from "@sca-frontend/utils";
import { AuthRouterComponent } from "../components";
import { SignInPageComponent, SignUpPageComponent } from "../pages";

export const AuthPath = "auth";
export const AuthSignInPath = "sign-in";
export const AuthSignUpPath = "sign-up";

export const AuthRoutes: Array<Route> = [
	{
		path: "",
		component: AuthRouterComponent,
		children: [
			{
				path: "",
				redirectTo: AuthSignInPath,
				pathMatch: "full",
			},
			{
				path: AuthSignInPath,
				data: WithoutLayout,
				component: SignInPageComponent,
			},
			{
				path: AuthSignUpPath,
				data: WithoutLayout,
				component: SignUpPageComponent,
			},
		],
	},
];
