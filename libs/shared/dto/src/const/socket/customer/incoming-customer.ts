export const IncomingCustomer = "IncomingCustomer";

export interface IIncomingCustomerRequestDto {
	currentLocation: string;
}

export interface IIncomingCustomerResponseDto {
	onlineAgents: number;
	trackingNumber: string;
}
