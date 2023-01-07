import { Inject, Injectable } from "@nestjs/common";
import type { AggregateService } from "@sca-backend/aggregate";
import { DispatcherService, SocketService } from "@sca-backend/socket";
import { AgentQueryDalService, type AgentRedisEntity } from "@sca-backend/data-access-layer";
import type { ICustomerAssigned, ICustomerExpiry, ICustomerReserved } from "@sca-backend/service-bus";
import { SocketBusMessages, SocketBusService } from "@sca-backend/service-bus";
import type {
	IConnectedCustomer,
	ICustomerAssignedNotification,
	ICustomerReservedNotification,
	IIncomingCustomerNotification,
	IOutgoingCustomerNotification,
	IReleasedCustomersNotification,
} from "@sca-shared/dto";
import { AgentNotificationEvents } from "@sca-shared/dto";
import { AgentUtilitiesAggregateConst } from "../../const";
import type { IAgentUtilitiesAggregate } from "../../types";

@Injectable()
export class AgentNotificationService extends SocketService {
	public constructor(
		// Dependencies

		private readonly socketBusService: SocketBusService,
		private readonly dispatcherService: DispatcherService,
		private readonly agentQueryDalService: AgentQueryDalService,
		@Inject(AgentUtilitiesAggregateConst) private readonly utilitiesAggregateService: AggregateService<IAgentUtilitiesAggregate>,
	) {
		super();

		this.listenForServiceBusMessages();
	}

	private listenForServiceBusMessages(): void {
		this.socketBusService.listenForMessage<IConnectedCustomer>(SocketBusMessages.NewCustomer).subscribe(this.sendNewCustomerNotificationToAgents.bind(this));
		this.socketBusService.listenForMessage<ICustomerExpiry>(SocketBusMessages.CustomerRemoved).subscribe(this.sendOutgoingCustomerNotificationToAgents.bind(this));
		this.socketBusService.listenForMessage<Array<IConnectedCustomer>>(SocketBusMessages.NewMultipleCustomers).subscribe(this.sendReleasedCustomersNotificationToAgents.bind(this));
		this.socketBusService.listenForMessage<ICustomerReserved>(SocketBusMessages.CustomerReservedNotification).subscribe(this.sendCustomerReservedNotificationToAgents.bind(this));
		this.socketBusService.listenForMessage<ICustomerAssigned>(SocketBusMessages.CustomerAssignedNotification).subscribe(this.sendCustomerAssignedNotificationToAgent.bind(this));
	}

	private async sendNewCustomerNotificationToAgents(newCustomer: IConnectedCustomer): Promise<void> {
		await this.utilitiesAggregateService.services.exceptionHandler.executeExceptionHandledOperation({
			operation: async () => {
				const onlineAgents = await this.agentQueryDalService.onlineAgentsOfProject(newCustomer.projectUuid);
				const onlineAgentsConnectionIds = onlineAgents.map((onlineAgent: AgentRedisEntity) => onlineAgent.connectionIds).flat();
				const incomingCustomerNotificationPayload: IIncomingCustomerNotification = { incomingCustomer: newCustomer };

				this.dispatcherService.dispatchMessage(AgentNotificationEvents.IncomingCustomerNotification, this.server, onlineAgentsConnectionIds, incomingCustomerNotificationPayload);
			},
		});
	}

	private async sendOutgoingCustomerNotificationToAgents(customerExpiryDto: ICustomerExpiry): Promise<void> {
		await this.utilitiesAggregateService.services.exceptionHandler.executeExceptionHandledOperation({
			operation: async () => {
				const onlineAgents = await this.agentQueryDalService.onlineAgentsOfProject(customerExpiryDto.projectUuid);
				const onlineAgentsConnectionIds = onlineAgents.map((onlineAgent: AgentRedisEntity) => onlineAgent.connectionIds).flat();
				const outgoingCustomerNotificationPayload: IOutgoingCustomerNotification = { outgoingCustomerUuid: customerExpiryDto.customerUuid };

				this.dispatcherService.dispatchMessage(AgentNotificationEvents.OutgoingCustomerNotification, this.server, onlineAgentsConnectionIds, outgoingCustomerNotificationPayload);
			},
		});
	}

	private async sendReleasedCustomersNotificationToAgents(customersReleased: Array<IConnectedCustomer>): Promise<void> {
		await this.utilitiesAggregateService.services.exceptionHandler.executeExceptionHandledOperation({
			operation: async () => {
				if (customersReleased.length === 0) return;
				const [{ projectUuid }] = customersReleased;

				const onlineAgents = await this.agentQueryDalService.onlineAgentsOfProject(projectUuid);
				const onlineAgentsConnectionIds = onlineAgents.map((onlineAgent: AgentRedisEntity) => onlineAgent.connectionIds).flat();
				const releasedCustomersNotificationPayload: IReleasedCustomersNotification = { releasedCustomers: customersReleased };

				this.dispatcherService.dispatchMessage(AgentNotificationEvents.ReleasedCustomersNotification, this.server, onlineAgentsConnectionIds, releasedCustomersNotificationPayload);
			},
		});
	}

	private async sendCustomerReservedNotificationToAgents(customerReserved: ICustomerReserved): Promise<void> {
		await this.utilitiesAggregateService.services.exceptionHandler.executeExceptionHandledOperation({
			operation: async () => {
				const { byAgentUuid, customer } = customerReserved;
				const agentsToNotify = await this.agentQueryDalService.fetchAgentOfProjectExcept(byAgentUuid, customer.projectUuid);
				const agentsConnectionIds = agentsToNotify.map((agent: AgentRedisEntity) => agent.connectionIds).flat();

				const customerReservedNotification: ICustomerReservedNotification = { customerUuid: customer.customerUuid };
				this.dispatcherService.dispatchMessage<ICustomerReservedNotification>(
					AgentNotificationEvents.CustomerReservedNotification,
					this.server,
					agentsConnectionIds,
					customerReservedNotification,
				);
			},
		});
	}

	private async sendCustomerAssignedNotificationToAgent(customerAssigned: ICustomerAssigned): Promise<void> {
		await this.utilitiesAggregateService.services.exceptionHandler.executeExceptionHandledOperation({
			operation: async () => {
				const { toAgentUuid, customer } = customerAssigned;

				const agentToNotify = await this.agentQueryDalService.fetchAgentOfProject(toAgentUuid, customer.projectUuid);
				if (!agentToNotify) return;

				const customerAssignedNotification: ICustomerAssignedNotification = { customerUuid: customer.customerUuid };
				this.dispatcherService.dispatchMessage<ICustomerAssignedNotification>(
					AgentNotificationEvents.CustomerAssignedNotification,
					this.server,
					agentToNotify.connectionIds,
					customerAssignedNotification,
				);
			},
		});
	}
}
