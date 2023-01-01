export const IncomingCustomer = "IncomingCustomer";

export class IncomingCustomerRequestDto {
	currentLocation: string;
}

export class IncomingCustomerResponseDto {
	onlineAgents: number;
	trackingNumber: string;
}
