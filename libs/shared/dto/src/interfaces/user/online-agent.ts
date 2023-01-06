import type { IUser } from "./user";

export interface IOnlineAgent {
	agentUuid: string;
	projectUuid: string;
	connectionIds: string[];
}

export interface IConnectedAgent extends IOnlineAgent {
	agent: IUser;
}
