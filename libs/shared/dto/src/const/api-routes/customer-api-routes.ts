export const CustomerApiRoutes = {
	Prefix: "customer",
	Routes: {
		HandleCustomer: {
			Method: "GET",
			Name: "customer.handle-customer",
			Path: "handle-customer",
		},
	},
} as const;
