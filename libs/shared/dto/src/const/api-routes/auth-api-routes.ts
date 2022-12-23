export const AuthApiRoutes = {
	prefix: "auth",
	routes: {
		signIn: {
			method: "POST",
			name: "auth.sign-in",
			path: "sign-in",
		},
		signUp: {
			method: "POST",
			name: "auth.sign-up",
			path: "sign-up",
		},
	},
} as const;
