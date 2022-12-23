export const CustomerApiRoutes = {
	prefix: "customer",
	routes: {
		handleCustomer: {
			method: "GET",
			name: "customer.handle-customer",
			path: "handle-customer",
		},
	},
} as const;
