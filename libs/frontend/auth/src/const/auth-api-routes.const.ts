import type { IRawApiRoute } from "@sca-frontend/api";
import { AuthApiRoutes } from "@sca-shared/dto";

export const AuthApiRoutesConst: Array<IRawApiRoute> = [
	{
		prefix: AuthApiRoutes.Prefix,
		routes: [
			{
				route: AuthApiRoutes.Routes.SignIn.Path,
				name: AuthApiRoutes.Routes.SignIn.Name,
				method: AuthApiRoutes.Routes.SignIn.Method,
				routeParams: [],
				queryParams: [],
			},
			{
				route: AuthApiRoutes.Routes.SignUp.Path,
				name: AuthApiRoutes.Routes.SignUp.Name,
				method: AuthApiRoutes.Routes.SignUp.Method,
				routeParams: [],
				queryParams: [],
			},
		],
	},
];
