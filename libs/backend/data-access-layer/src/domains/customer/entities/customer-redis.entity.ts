import type { Nullable } from "@sca-shared/utils";
import { Schema } from "redis-om";
import { BaseRedisEntity } from "@sca-backend/db";

export interface CustomerRedisEntity {
	agentUuid: Nullable<string>;
	projectUuid: string;
	customerUuid: string;
	connectionIds: string[];
	customerTrackingId: string;
}

export class CustomerRedisEntity extends BaseRedisEntity<CustomerRedisEntity> {}

export const CustomerRedisSchema: Schema<CustomerRedisEntity> = new Schema(
	CustomerRedisEntity,
	{
		agentUuid: { type: "string" },
		projectUuid: { type: "string" },
		customerUuid: { type: "string" },
		connectionIds: { type: "string[]" },
		customerTrackingId: { type: "string" },
	},
	{
		dataStructure: "JSON",
	},
);
