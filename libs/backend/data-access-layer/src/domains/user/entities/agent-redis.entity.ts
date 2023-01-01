import { Schema } from "redis-om";
import { BaseRedisEntity } from "@sca-backend/db";
import type { IOnlineAgent } from "@sca-shared/dto";

export class AgentRedisEntity extends BaseRedisEntity<AgentRedisEntity> implements IOnlineAgent {
	public agentUuid: string;
	public projectUuid: string;
	public connectionIds: string[];
}

export const AgentRedisSchema: Schema<AgentRedisEntity> = new Schema(
	AgentRedisEntity,
	{
		agentUuid: { type: "string" },
		projectUuid: { type: "string" },
		connectionIds: { type: "string[]" },
	},
	{
		dataStructure: "JSON",
	},
);
