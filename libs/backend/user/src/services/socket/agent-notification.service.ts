import { Inject, Injectable } from "@nestjs/common";
import type { AggregateService } from "@sca-backend/aggregate";
import { DispatcherService, SocketService } from "@sca-backend/socket";
import { AgentConnectionDalService, type AgentRedisEntity } from "@sca-backend/data-access-layer";
import { type CustomerExpiryDto, SocketBusMessages, SocketBusService } from "@sca-backend/service-bus";
import type { IConnectedCustomer, IIncomingCustomerNotificationPayloadDto, IOutgoingCustomerNotificationPayloadDto, IReleasedCustomersNotificationPayloadDto } from "@sca-shared/dto";
import { AgentNotificationEvents } from "@sca-shared/dto";
import { AgentUtilitiesAggregateConst } from "../../const";
import type { IAgentUtilitiesAggregate } from "../../types";

@Injectable()
export class AgentNotificationService extends SocketService {
	public constructor(
		// Dependencies

		private readonly socketBusService: SocketBusService,
		private readonly dispatcherService: DispatcherService,
		private readonly agentConnectionDalService: AgentConnectionDalService,
		@Inject(AgentUtilitiesAggregateConst) private readonly utilitiesAggregateService: AggregateService<IAgentUtilitiesAggregate>,
	) {
		super();

		this.listenForServiceBusMessages();
	}

	private listenForServiceBusMessages(): void {
		this.socketBusService.listenForMessage<IConnectedCustomer>(SocketBusMessages.NewCustomer).subscribe(this.sendNewCustomerNotificationToAgents.bind(this));
		this.socketBusService.listenForMessage<CustomerExpiryDto>(SocketBusMessages.CustomerRemoved).subscribe(this.sendOutgoingCustomerNotificationToAgents.bind(this));
		this.socketBusService.listenForMessage<Array<IConnectedCustomer>>(SocketBusMessages.NewMultipleCustomers).subscribe(this.sendReleasedCustomersNotificationToAgents.bind(this));
	}

	private async sendNewCustomerNotificationToAgents(newCustomer: IConnectedCustomer): Promise<void> {
		await this.utilitiesAggregateService.services.exceptionHandler.executeExceptionHandledOperation({
			operation: async () => {
				const onlineAgents = await this.agentConnectionDalService.onlineAgentsOfProject(newCustomer.projectUuid);
				const onlineAgentsConnectionIds = onlineAgents.map((onlineAgent: AgentRedisEntity) => onlineAgent.connectionIds).flat();
				const incomingCustomerNotificationPayload: IIncomingCustomerNotificationPayloadDto = { incomingCustomer: newCustomer };

				this.dispatcherService.dispatchMessage(AgentNotificationEvents.IncomingCustomerNotification, this.server, onlineAgentsConnectionIds, incomingCustomerNotificationPayload);
			},
		});
	}

	private async sendOutgoingCustomerNotificationToAgents(customerExpiryDto: CustomerExpiryDto): Promise<void> {
		await this.utilitiesAggregateService.services.exceptionHandler.executeExceptionHandledOperation({
			operation: async () => {
				const onlineAgents = await this.agentConnectionDalService.onlineAgentsOfProject(customerExpiryDto.projectUuid);
				const onlineAgentsConnectionIds = onlineAgents.map((onlineAgent: AgentRedisEntity) => onlineAgent.connectionIds).flat();
				const outgoingCustomerNotificationPayload: IOutgoingCustomerNotificationPayloadDto = { outgoingCustomerUuid: customerExpiryDto.customerUuid };

				this.dispatcherService.dispatchMessage(AgentNotificationEvents.OutgoingCustomerNotification, this.server, onlineAgentsConnectionIds, outgoingCustomerNotificationPayload);
			},
		});
	}

	private async sendReleasedCustomersNotificationToAgents(customersReleased: Array<IConnectedCustomer>): Promise<void> {
		await this.utilitiesAggregateService.services.exceptionHandler.executeExceptionHandledOperation({
			operation: async () => {
				if (customersReleased.length === 0) return;
				const [{ projectUuid }] = customersReleased;

				const onlineAgents = await this.agentConnectionDalService.onlineAgentsOfProject(projectUuid);
				const onlineAgentsConnectionIds = onlineAgents.map((onlineAgent: AgentRedisEntity) => onlineAgent.connectionIds).flat();
				const releasedCustomersNotificationPayload: IReleasedCustomersNotificationPayloadDto = { releasedCustomers: customersReleased };

				this.dispatcherService.dispatchMessage(AgentNotificationEvents.ReleasedCustomersNotification, this.server, onlineAgentsConnectionIds, releasedCustomersNotificationPayload);
			},
		});
	}
}
