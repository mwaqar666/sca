export const AuthApiRoutes = {
	Prefix: "auth",
	Routes: {
		SignIn: {
			Method: "POST",
			Name: "auth.sign-in",
			Path: "sign-in",
		},
		SignUp: {
			Method: "POST",
			Name: "auth.sign-up",
			Path: "sign-up",
		},
		Refresh: {
			Method: "POST",
			Name: "auth.refresh",
			Path: "refresh",
		},
	},
} as const;
