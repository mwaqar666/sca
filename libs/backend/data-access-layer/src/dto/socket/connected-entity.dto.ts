import type { Nullable } from "@sca-shared/utils";
import type { CustomerEntity, UserEntity } from "../../domains";
import type { IConnectedAgent, IConnectedCustomer } from "@sca-shared/dto";

export class ConnectedCustomerDto implements IConnectedCustomer {
	public agentUuid: Nullable<string>;
	public connectionIds: string[];
	public customerUuid: string;
	public projectUuid: string;
	public trackingNumber: string;
	public customer: CustomerEntity;
}

export class ConnectedAgentDto implements IConnectedAgent {
	public agentUuid: string;
	public projectUuid: string;
	public connectionIds: string[];
	public agent: UserEntity;
}
