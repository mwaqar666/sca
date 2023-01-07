import { Inject, Injectable } from "@nestjs/common";
import type { Socket } from "socket.io";
import { SocketService } from "@sca-backend/socket";
import type { IConnectedCustomer } from "@sca-shared/dto";
import type { AggregateService } from "@sca-backend/aggregate";
import { AuthUser, type AuthUserSocket } from "@sca-backend/auth";
import { AgentConnectionDalService, CustomerBuilderDalService, SessionDalService } from "@sca-backend/data-access-layer";
import { type IAgentExpiry, SocketBusMessages, SocketBusService } from "@sca-backend/service-bus";
import { AgentUtilitiesAggregateConst } from "../../const";
import type { IAgentUtilitiesAggregate } from "../../types";

@Injectable()
export class AgentConnectionService extends SocketService {
	public constructor(
		// Dependencies

		private readonly socketBusService: SocketBusService,
		private readonly sessionDalService: SessionDalService,
		private readonly customerBuilderDalService: CustomerBuilderDalService,
		private readonly agentConnectionDalService: AgentConnectionDalService,
		@Inject(AgentUtilitiesAggregateConst) private readonly utilitiesAggregateService: AggregateService<IAgentUtilitiesAggregate>,
	) {
		super();

		this.listenForServiceBusMessages();
	}

	public async handleIncomingAgent(agentSocket: AuthUserSocket): Promise<void> {
		await this.utilitiesAggregateService.services.exceptionHandler.executeExceptionHandledOperation({
			operation: async () => {
				const authenticatedAgent = agentSocket.data[AuthUser];

				return await this.agentConnectionDalService.connectAgent(authenticatedAgent, agentSocket.id);
			},
		});
	}

	public async handleOutgoingConnection(socket: Socket): Promise<void> {
		return await this.utilitiesAggregateService.services.exceptionHandler.executeExceptionHandledOperation({
			operation: async () => {
				const agentDisconnection = await this.agentConnectionDalService.disconnectAgent(socket.id);
				if (agentDisconnection.status !== "ExpiryAdded") return;

				/**
				 * =====================================
				 * !!! Disclaimer: Memory Leak Ahead !!!
				 * =====================================
				 * This subscriber runs when the agent gets expired after the passage
				 * of reconnecting threshold time, and then unsubscribes itself due to the
				 * presence of "first()" operator. In the case, where agent reconnects
				 * in threshold time, this subscriber will never be called and will remain
				 * hanging for the rest of application life-cycle. This needs to be fixed
				 * on high priority.
				 */
				agentDisconnection.postExpiryTasks.subscribe(async () => {
					const { entity } = agentDisconnection;
					const { agentUuid, projectUuid } = entity;

					await this.socketBusService.publishMessage<IAgentExpiry>(SocketBusMessages.AgentRemoved, { agentUuid, projectUuid });
				});
			},
		});
	}

	private listenForServiceBusMessages(): void {
		this.socketBusService.listenForMessage<IAgentExpiry>(SocketBusMessages.AgentRemoved).subscribe(this.postAgentConnectionRemovalTasks.bind(this));
	}

	private async postAgentConnectionRemovalTasks(agentExpiryDto: IAgentExpiry): Promise<void> {
		return await this.utilitiesAggregateService.services.exceptionHandler.executeExceptionHandledOperation({
			operation: async () => {
				const releasedCustomers = await this.sessionDalService.unAssignAgentFromAllItsProjectCustomers(agentExpiryDto.agentUuid, agentExpiryDto.projectUuid);
				const releasedConnectedCustomers = await this.customerBuilderDalService.buildConnectedCustomer(releasedCustomers);

				// await this.agentChatService.closeCustomersCurrentConversation(socket.data.agent, agentCustomers);
				await this.socketBusService.publishMessage<Array<IConnectedCustomer>>(SocketBusMessages.NewMultipleCustomers, releasedConnectedCustomers);
				await this.socketBusService.publishMessage<Array<IConnectedCustomer>>(SocketBusMessages.AgentUnavailable, releasedConnectedCustomers);
			},
		});
	}
}
