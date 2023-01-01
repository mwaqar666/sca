import { Schema } from "redis-om";
import { BaseRedisEntity } from "@sca-backend/db";
import type { IOnlineCustomer } from "@sca-shared/dto";
import type { Nullable } from "@sca-shared/utils";

export class CustomerRedisEntity extends BaseRedisEntity<CustomerRedisEntity> implements IOnlineCustomer {
	public agentUuid: Nullable<string>;
	public projectUuid: string;
	public customerUuid: string;
	public connectionIds: string[];
	public trackingNumber: string;
}

export const CustomerRedisSchema: Schema<CustomerRedisEntity> = new Schema(
	CustomerRedisEntity,
	{
		agentUuid: { type: "string" },
		projectUuid: { type: "string" },
		customerUuid: { type: "string" },
		connectionIds: { type: "string[]" },
		trackingNumber: { type: "string" },
	},
	{
		dataStructure: "JSON",
	},
);
