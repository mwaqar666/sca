export const AuthApiRoutes = {
	prefix: "auth",
	routes: {
		signIn: {
			method: "POST",
			name: "auth.sign-in",
			path: "project/sign-in",
		},
		signUp: {
			method: "POST",
			name: "auth.sign-up",
			path: "project/sign-up",
		},
	},
} as const;
