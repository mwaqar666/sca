import type { IRawApiRoute } from "@sca-frontend/api";
import { AuthApiRoutes } from "@sca-shared/dto";

export const AuthApiRoutesConst: Array<IRawApiRoute> = [
	{
		prefix: AuthApiRoutes.prefix,
		routes: [
			{
				route: AuthApiRoutes.routes.signIn.path,
				name: AuthApiRoutes.routes.signIn.name,
				method: AuthApiRoutes.routes.signIn.method,
				routeParams: [],
				queryParams: [],
			},
			{
				route: AuthApiRoutes.routes.signUp.path,
				name: AuthApiRoutes.routes.signUp.name,
				method: AuthApiRoutes.routes.signUp.method,
				routeParams: [],
				queryParams: [],
			},
		],
	},
];
