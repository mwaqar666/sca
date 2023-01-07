import { Inject, Injectable } from "@nestjs/common";
import { type AgentRedisEntity, type UserEntity, UserService } from "../../domains";
import type { IConnectedAgent } from "@sca-shared/dto";
import { DomainUtilitiesAggregateConst } from "../../const";
import type { AggregateService } from "@sca-backend/aggregate";
import type { IDomainUtilitiesAggregate } from "../../types";

@Injectable()
export class AgentBuilderDalService {
	public constructor(
		// Dependencies

		private readonly userService: UserService,
		@Inject(DomainUtilitiesAggregateConst) private readonly utilitiesAggregateService: AggregateService<IDomainUtilitiesAggregate>,
	) {}

	public async buildConnectedAgent(redisAgents: AgentRedisEntity): Promise<IConnectedAgent>;
	public async buildConnectedAgent(redisAgents: Array<AgentRedisEntity>): Promise<Array<IConnectedAgent>>;
	public async buildConnectedAgent(redisAgents: AgentRedisEntity, agent: UserEntity): Promise<IConnectedAgent>;
	public async buildConnectedAgent(redisAgents: AgentRedisEntity | Array<AgentRedisEntity>, agent?: UserEntity): Promise<IConnectedAgent | Array<IConnectedAgent>> {
		return await this.utilitiesAggregateService.services.exceptionHandler.executeExceptionHandledOperation({
			operation: async () => {
				if (!Array.isArray(redisAgents)) {
					agent = agent ?? (await this.userService.findOrFailUserUsingUuid(redisAgents.agentUuid));

					return this.mergeRedisAgentWithDbAgent(agent, redisAgents);
				}

				return Promise.all(
					redisAgents.map((redisAgent: AgentRedisEntity) => {
						return this.userService.findOrFailUserUsingUuid(redisAgent.agentUuid).then((agent: UserEntity) => this.mergeRedisAgentWithDbAgent(agent, redisAgent));
					}),
				);
			},
		});
	}

	private mergeRedisAgentWithDbAgent(agent: UserEntity, redisAgent: AgentRedisEntity): Promise<IConnectedAgent> {
		return this.utilitiesAggregateService.services.exceptionHandler.executeExceptionHandledOperation({
			operation: async () => {
				const { agentUuid, connectionIds, projectUuid } = redisAgent;
				return { agent, agentUuid, connectionIds, projectUuid };
			},
		});
	}
}
