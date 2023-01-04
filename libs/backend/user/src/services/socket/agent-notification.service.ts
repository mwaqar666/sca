import { DispatcherService, SocketService } from "@sca-backend/socket";
import { Inject, Injectable } from "@nestjs/common";
import { AgentRedisEntity, ConnectedAgentService, type ConnectedCustomerDto } from "@sca-backend/data-access-layer";
import { type CustomerExpiryDto, type CustomersReleasedDto, SocketBusMessages, SocketBusService } from "@sca-backend/service-bus";
import type { AggregateService } from "@sca-backend/aggregate";
import type { IAgentUtilitiesAggregate } from "../../types";
import { AgentUtilitiesAggregateConst } from "../../const";
import {
	IncomingCustomerNotification,
	type IncomingCustomerNotificationPayloadDto,
	IncomingCustomersNotification,
	type IncomingCustomersNotificationPayloadDto,
	OutgoingCustomerNotification,
	type OutgoingCustomerNotificationPayloadDto,
} from "@sca-shared/dto";

@Injectable()
export class AgentNotificationService extends SocketService {
	public constructor(
		// Dependencies

		private readonly socketBusService: SocketBusService,
		private readonly dispatcherService: DispatcherService,
		private readonly connectedAgentService: ConnectedAgentService,
		@Inject(AgentUtilitiesAggregateConst) private readonly utilitiesAggregateService: AggregateService<IAgentUtilitiesAggregate>,
	) {
		super();

		this.listenForServiceBusMessages();
	}

	private listenForServiceBusMessages(): void {
		this.socketBusService.listenForMessage<ConnectedCustomerDto>(SocketBusMessages.NotifyAllAgentsOfNewCustomer).subscribe(this.sendNewCustomerNotificationToAgents.bind(this));
		this.socketBusService.listenForMessage<CustomerExpiryDto>(SocketBusMessages.CustomerRemoved).subscribe(this.sendOutgoingCustomerNotificationToAgents.bind(this));
		this.socketBusService.listenForMessage<CustomersReleasedDto>(SocketBusMessages.FreeCustomersNotificationToAgents).subscribe(this.sendReleasedCustomersNotificationToAgents.bind(this));
	}

	private async sendNewCustomerNotificationToAgents(newCustomer: ConnectedCustomerDto): Promise<void> {
		await this.utilitiesAggregateService.services.exceptionHandler.executeExceptionHandledOperation({
			operation: async () => {
				const onlineAgents = await this.connectedAgentService.onlineAgentsOfProject(newCustomer.projectUuid);
				const onlineAgentsConnectionIds = onlineAgents.map((onlineAgent: AgentRedisEntity) => onlineAgent.connectionIds).flat();
				const incomingCustomerNotificationPayload: IncomingCustomerNotificationPayloadDto = { incomingCustomer: newCustomer };

				this.dispatcherService.dispatchMessage(IncomingCustomerNotification, this.server, onlineAgentsConnectionIds, incomingCustomerNotificationPayload);
			},
		});
	}

	private async sendOutgoingCustomerNotificationToAgents(customerExpiryDto: CustomerExpiryDto): Promise<void> {
		await this.utilitiesAggregateService.services.exceptionHandler.executeExceptionHandledOperation({
			operation: async () => {
				const onlineAgents = await this.connectedAgentService.onlineAgentsOfProject(customerExpiryDto.projectUuid);
				const onlineAgentsConnectionIds = onlineAgents.map((onlineAgent: AgentRedisEntity) => onlineAgent.connectionIds).flat();
				const outgoingCustomerNotificationPayload: OutgoingCustomerNotificationPayloadDto = { outgoingCustomerUuid: customerExpiryDto.customerUuid };

				this.dispatcherService.dispatchMessage(OutgoingCustomerNotification, this.server, onlineAgentsConnectionIds, outgoingCustomerNotificationPayload);
			},
		});
	}

	private async sendReleasedCustomersNotificationToAgents(customersReleased: CustomersReleasedDto): Promise<void> {
		await this.utilitiesAggregateService.services.exceptionHandler.executeExceptionHandledOperation({
			operation: async () => {
				const onlineAgents = await this.connectedAgentService.onlineAgentsOfProject(customersReleased.projectUuid);
				const onlineAgentsConnectionIds = onlineAgents.map((onlineAgent: AgentRedisEntity) => onlineAgent.connectionIds).flat();
				const outgoingCustomerNotificationPayload: IncomingCustomersNotificationPayloadDto = { incomingCustomers: customersReleased.releasedCustomers };

				this.dispatcherService.dispatchMessage(IncomingCustomersNotification, this.server, onlineAgentsConnectionIds, outgoingCustomerNotificationPayload);
			},
		});
	}
}
