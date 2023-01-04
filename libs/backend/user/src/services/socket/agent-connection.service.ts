import { Inject, Injectable } from "@nestjs/common";
import { ConnectedAgentService, type ConnectedCustomerDto, ConnectedCustomerService } from "@sca-backend/data-access-layer";
import { SocketService } from "@sca-backend/socket";
import type { AuthUserSocket } from "@sca-backend/auth";
import { AuthUser } from "@sca-backend/auth";
import { AgentUtilitiesAggregateConst } from "../../const";
import type { AggregateService } from "@sca-backend/aggregate";
import type { IAgentUtilitiesAggregate } from "../../types";
import type { Socket } from "socket.io";
import { type AgentExpiryDto, type CustomersReleasedDto, SocketBusMessages, SocketBusService } from "@sca-backend/service-bus";

@Injectable()
export class AgentConnectionService extends SocketService {
	public constructor(
		// Dependencies

		private readonly socketBusService: SocketBusService,
		private readonly connectedAgentService: ConnectedAgentService,
		private readonly connectedCustomerService: ConnectedCustomerService,
		@Inject(AgentUtilitiesAggregateConst) private readonly utilitiesAggregateService: AggregateService<IAgentUtilitiesAggregate>,
	) {
		super();

		this.listenForServiceBusMessages();
	}

	public async handleIncomingAgent(agentSocket: AuthUserSocket): Promise<void> {
		await this.utilitiesAggregateService.services.exceptionHandler.executeExceptionHandledOperation({
			operation: async () => {
				const authenticatedAgent = agentSocket.data[AuthUser];

				return await this.connectedAgentService.connectAgent(authenticatedAgent, agentSocket.id);
			},
		});
	}

	public async handleOutgoingConnection(socket: Socket): Promise<void> {
		return await this.utilitiesAggregateService.services.exceptionHandler.executeExceptionHandledOperation({
			operation: async () => {
				const agentDisconnection = await this.connectedAgentService.disconnectAgent(socket.id);
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

					await this.socketBusService.publishMessage<AgentExpiryDto>(SocketBusMessages.AgentRemoved, { agentUuid, projectUuid });
				});
			},
		});
	}

	private listenForServiceBusMessages(): void {
		this.socketBusService.listenForMessage<AgentExpiryDto>(SocketBusMessages.AgentRemoved).subscribe(this.postAgentConnectionRemovalTasks.bind(this));
	}

	private async postAgentConnectionRemovalTasks(agentExpiryDto: AgentExpiryDto): Promise<void> {
		return await this.utilitiesAggregateService.services.exceptionHandler.executeExceptionHandledOperation({
			operation: async () => {
				const releasedCustomers = await this.connectedCustomerService.releaseCustomersFromAgentOfProject(agentExpiryDto.agentUuid, agentExpiryDto.projectUuid);
				const releasedConnectedCustomers = await this.connectedCustomerService.prepareMultipleConnectedCustomerDto(releasedCustomers);
				const customersReleasedDto: CustomersReleasedDto = { projectUuid: agentExpiryDto.projectUuid, releasedCustomers: releasedConnectedCustomers };

				// await this.agentChatService.closeCustomersCurrentConversation(socket.data.agent, agentCustomers);
				await this.socketBusService.publishMessage<CustomersReleasedDto>(SocketBusMessages.FreeCustomersNotificationToAgents, customersReleasedDto);
				await this.socketBusService.publishMessage<Array<ConnectedCustomerDto>>(SocketBusMessages.FreeCustomersNotificationToCustomers, releasedConnectedCustomers);
			},
		});
	}
}
