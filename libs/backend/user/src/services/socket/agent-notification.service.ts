import { DispatcherService, SocketService } from "@sca-backend/socket";
import { Inject, Injectable } from "@nestjs/common";
import { AgentRedisEntity, ConnectedAgentService, type ConnectedCustomerDto } from "@sca-backend/data-access-layer";
import { SocketBusMessages, SocketBusService } from "@sca-backend/service-bus";
import type { AggregateService } from "@sca-backend/aggregate";
import type { IAgentUtilitiesAggregate } from "../../types";
import { AgentUtilitiesAggregateConst } from "../../const";
import { IncomingCustomerNotification, IncomingCustomerNotificationPayloadDto } from "@sca-shared/dto";

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

	public listenForServiceBusMessages(): void {
		this.socketBusService.listenForMessage<ConnectedCustomerDto>(SocketBusMessages.NotifyAllAgentsOfNewCustomer).subscribe(this.sendNewCustomerNotificationToOnlineAgents);
	}

	public async sendNewCustomerNotificationToOnlineAgents(newCustomer: ConnectedCustomerDto): Promise<void> {
		await this.utilitiesAggregateService.services.exceptionHandler.executeExceptionHandledOperation({
			operation: async () => {
				const onlineAgents = await this.connectedAgentService.onlineAgentsOfProject(newCustomer.projectUuid);
				const onlineAgentsConnectionIds = onlineAgents.map((onlineAgent: AgentRedisEntity) => onlineAgent.connectionIds).flat();
				const incomingCustomerNotificationPayload: IncomingCustomerNotificationPayloadDto = { incomingCustomer: newCustomer };

				this.dispatcherService.dispatchMessage(IncomingCustomerNotification, this.server, onlineAgentsConnectionIds, incomingCustomerNotificationPayload);
			},
		});
	}
}
