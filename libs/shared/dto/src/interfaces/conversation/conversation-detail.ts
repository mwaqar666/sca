import type { Key, Nullable } from "@sca-shared/utils";

export interface IConversationDetails {
	conversation: Array<IMessage>;
}

export interface IBaseMessage {
	message: Nullable<string>;
	files: Array<string>;
}

export interface IMessageFromCustomerToAgent extends IBaseMessage {
	from: "Customer";
	to: "Agent";
}

export interface IMessageFromCustomerToAllAgents extends IBaseMessage {
	from: "Customer";
	to: "AllAgents";
}

export interface IMessageFromAgentToCustomer extends IBaseMessage {
	from: "Agent";
	to: "Customer";
}

export type IMessage = IMessageFromCustomerToAgent | IMessageFromAgentToCustomer | IMessageFromCustomerToAllAgents;

export type IDirection<M extends IBaseMessage> = Omit<M, Key<IBaseMessage>>;

export type IMessageDirection = IDirection<IMessageFromCustomerToAgent> | IDirection<IMessageFromCustomerToAllAgents> | IDirection<IMessageFromAgentToCustomer>;
