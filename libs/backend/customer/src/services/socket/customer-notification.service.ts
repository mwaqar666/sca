import { Inject, Injectable } from "@nestjs/common";
import { CustomerUtilitiesAggregateConst } from "../../const";
import { DispatcherService, SocketService } from "@sca-backend/socket";
import type { ICustomerUtilitiesAggregate } from "../../types";
import type { AggregateService } from "@sca-backend/aggregate";
import type { IAgentAssigned, IAgentUnAssigned } from "@sca-backend/service-bus";
import { SocketBusMessages, SocketBusService } from "@sca-backend/service-bus";
import type { IAgentAssignedNotification, IConnectedCustomer } from "@sca-shared/dto";
import { CustomerNotificationEvents } from "@sca-shared/dto";
import { AgentBuilderDalService, AgentQueryDalService } from "@sca-backend/data-access-layer";

@Injectable()
export class CustomerNotificationService extends SocketService {
	public constructor(
		// Dependencies

		private readonly socketBusService: SocketBusService,
		private readonly dispatcherService: DispatcherService,
		private readonly agentQueryDalService: AgentQueryDalService,
		private readonly agentBuilderDalService: AgentBuilderDalService,
		@Inject(CustomerUtilitiesAggregateConst) private readonly utilitiesAggregateService: AggregateService<ICustomerUtilitiesAggregate>,
	) {
		super();

		this.listenForServiceBusMessages();
	}

	private listenForServiceBusMessages(): void {
		this.socketBusService.listenForMessage<Array<IConnectedCustomer>>(SocketBusMessages.AgentUnavailable).subscribe(this.sendReleasedCustomersNotification.bind(this));
		this.socketBusService.listenForMessage<IAgentAssigned>(SocketBusMessages.AgentAssignedNotification).subscribe(this.sendAgentAssignedNotification.bind(this));
		this.socketBusService.listenForMessage<IAgentAssigned>(SocketBusMessages.AgentUnAssignedNotification).subscribe(this.sendAgentUnAssignedNotification.bind(this));
	}

	private async sendReleasedCustomersNotification(connectedCustomers: Array<IConnectedCustomer>): Promise<void> {
		await this.utilitiesAggregateService.services.exceptionHandler.executeExceptionHandledOperation({
			operation: async () => {
				const customerConnectionIds = connectedCustomers.map((connectedCustomer: IConnectedCustomer) => connectedCustomer.connectionIds).flat();

				this.dispatcherService.dispatchMessage(CustomerNotificationEvents.OutgoingAgentNotification, this.server, customerConnectionIds);
			},
		});
	}

	private async sendAgentAssignedNotification(agentAssigned: IAgentAssigned): Promise<void> {
		await this.utilitiesAggregateService.services.exceptionHandler.executeExceptionHandledOperation({
			operation: async () => {
				const { toAgentUuid, customer } = agentAssigned;

				const agent = await this.agentQueryDalService.fetchAgentOfProject(toAgentUuid, customer.projectUuid);
				if (!agent) return;

				const connectedAgent = await this.agentBuilderDalService.buildConnectedAgent(agent);

				const agentAssignedNotification: IAgentAssignedNotification = { agent: connectedAgent };
				this.dispatcherService.dispatchMessage<IAgentAssignedNotification>(
					CustomerNotificationEvents.AgentAssignedNotification,
					this.server,
					agentAssigned.customer.connectionIds,
					agentAssignedNotification,
				);
			},
		});
	}

	private async sendAgentUnAssignedNotification(agentAssigned: IAgentUnAssigned): Promise<void> {
		await this.utilitiesAggregateService.services.exceptionHandler.executeExceptionHandledOperation({
			operation: async () => {
				this.dispatcherService.dispatchMessage(CustomerNotificationEvents.AgentUnAssignedNotification, this.server, agentAssigned.customer.connectionIds);
			},
		});
	}
}
