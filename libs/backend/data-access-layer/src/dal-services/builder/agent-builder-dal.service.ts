import { Inject, Injectable } from "@nestjs/common";
import { UserService } from "../../domains";
import type { IConnectedAgent, IOnlineAgent, IUser } from "@sca-shared/dto";
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

	public async buildConnectedAgent(redisAgents: IOnlineAgent): Promise<IConnectedAgent>;
	public async buildConnectedAgent(redisAgents: Array<IOnlineAgent>): Promise<Array<IConnectedAgent>>;
	public async buildConnectedAgent(redisAgents: IOnlineAgent, agent: IUser): Promise<IConnectedAgent>;
	public async buildConnectedAgent(redisAgents: IOnlineAgent | Array<IOnlineAgent>, agent?: IUser): Promise<IConnectedAgent | Array<IConnectedAgent>> {
		return await this.utilitiesAggregateService.services.exceptionHandler.executeExceptionHandledOperation({
			operation: async () => {
				if (!Array.isArray(redisAgents)) {
					agent = agent ?? (await this.userService.findOrFailUserUsingUuid(redisAgents.agentUuid));

					return this.mergeRedisAgentWithDbAgent(agent, redisAgents);
				}

				return Promise.all(
					redisAgents.map((redisAgent: IOnlineAgent) => {
						return this.userService.findOrFailUserUsingUuid(redisAgent.agentUuid).then((agent: IUser) => this.mergeRedisAgentWithDbAgent(agent, redisAgent));
					}),
				);
			},
		});
	}

	private mergeRedisAgentWithDbAgent(agent: IUser, redisAgent: IOnlineAgent): Promise<IConnectedAgent> {
		return this.utilitiesAggregateService.services.exceptionHandler.executeExceptionHandledOperation({
			operation: async () => {
				const { agentUuid, connectionIds, projectUuid } = redisAgent;
				return { agent, agentUuid, connectionIds, projectUuid };
			},
		});
	}
}
