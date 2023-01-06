export class AgentRequestEvents {
	public static readonly IncomingAgent = "IncomingAgent";
	public static readonly ProjectCustomers = "ProjectCustomers";
	public static readonly StartSessionWithCustomer = "StartSessionWithCustomer";
}

export class AgentNotificationEvents {
	public static readonly IncomingCustomerNotification = "IncomingCustomerNotification";
	public static readonly OutgoingCustomerNotification = "OutgoingCustomerNotification";
	public static readonly ReleasedCustomersNotification = "ReleasedCustomersNotification";
}
