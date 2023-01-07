import type { IConnectedAgent } from "../../../interfaces";

export interface IIncomingCustomerRequestDto {
	currentLocation: string;
}

export interface IIncomingCustomerResponse {
	onlineAgents: number;
	trackingNumber: string;
}

export interface IAgentAssignedNotification {
	agent: IConnectedAgent;
}
