import { Inject, Injectable } from "@nestjs/common";
import { ConnectedAgentService } from "@sca-backend/data-access-layer";
import { SocketService } from "@sca-backend/socket";
import type { AuthUserSocket } from "@sca-backend/auth";
import { AuthUser } from "@sca-backend/auth";
import { AgentUtilitiesAggregateConst } from "../../const";
import type { AggregateService } from "@sca-backend/aggregate";
import type { IAgentUtilitiesAggregate } from "../../types";

@Injectable()
export class AgentConnectionService extends SocketService {
	public constructor(
		// Dependencies

		private readonly connectedAgentService: ConnectedAgentService,
		@Inject(AgentUtilitiesAggregateConst) private readonly utilitiesAggregateService: AggregateService<IAgentUtilitiesAggregate>,
	) {
		super();
	}

	public async handleIncomingAgent(agentSocket: AuthUserSocket): Promise<void> {
		await this.utilitiesAggregateService.services.exceptionHandler.executeExceptionHandledOperation({
			operation: async () => {
				const authenticatedAgent = agentSocket.data[AuthUser];

				return await this.connectedAgentService.connectAgent(authenticatedAgent, agentSocket.id);
			},
		});
	}
}
