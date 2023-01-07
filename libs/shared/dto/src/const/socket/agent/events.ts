export class AgentRequestEvents {
	public static readonly IncomingAgent = "IncomingAgent";
	public static readonly ProjectCustomers = "ProjectCustomers";
	public static readonly StartSessionWithCustomer = "StartSessionWithCustomer";
	public static readonly EndSessionWithCustomer = "EndSessionWithCustomer";
}

export class AgentNotificationEvents {
	public static readonly IncomingCustomerNotification = "IncomingCustomerNotification";
	public static readonly OutgoingCustomerNotification = "OutgoingCustomerNotification";
	public static readonly ReleasedCustomersNotification = "ReleasedCustomersNotification";
	public static readonly CustomerReservedNotification = "CustomerReservedNotification";
	public static readonly CustomerAssignedNotification = "CustomerAssignedNotification";
	public static readonly CustomerUnReservedNotification = "CustomerUnReservedNotification";
	public static readonly CustomerUnAssignedNotification = "CustomerUnAssignedNotification";
}
