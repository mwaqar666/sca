import type { Key } from "@sca-shared/utils";

export interface IConversationDetails {
	conversation: Array<IMessageFromCustomerToAgent | IMessageFromAgentToCustomer>;
}

export interface IMessage {
	message?: string;
	files?: string[];
}

export interface IMessageFromCustomerToAgent extends IMessage {
	from: "Customer";
	to: "Agent";
}

export interface IMessageFromAgentToCustomer extends IMessage {
	from: "Agent";
	to: "Customer";
}

export type IMessageDirection = Omit<IMessageFromCustomerToAgent, Key<IMessage>> | Omit<IMessageFromAgentToCustomer, Key<IMessage>>;
