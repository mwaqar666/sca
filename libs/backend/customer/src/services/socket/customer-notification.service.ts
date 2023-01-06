import { Inject, Injectable } from "@nestjs/common";
import { CustomerUtilitiesAggregateConst } from "../../const";
import { DispatcherService, SocketService } from "@sca-backend/socket";
import type { ICustomerUtilitiesAggregate } from "../../types";
import type { AggregateService } from "@sca-backend/aggregate";
import { SocketBusMessages, SocketBusService } from "@sca-backend/service-bus";
import { CustomerNotificationEvents, type IConnectedCustomer } from "@sca-shared/dto";

@Injectable()
export class CustomerNotificationService extends SocketService {
	public constructor(
		// Dependencies

		private readonly socketBusService: SocketBusService,
		private readonly dispatcherService: DispatcherService,
		@Inject(CustomerUtilitiesAggregateConst) private readonly utilitiesAggregateService: AggregateService<ICustomerUtilitiesAggregate>,
	) {
		super();

		this.listenForServiceBusMessages();
	}

	private listenForServiceBusMessages(): void {
		this.socketBusService.listenForMessage<Array<IConnectedCustomer>>(SocketBusMessages.AgentUnavailable).subscribe(this.sendReleasedCustomersNotificationToCustomers.bind(this));
	}

	private async sendReleasedCustomersNotificationToCustomers(connectedCustomers: Array<IConnectedCustomer>): Promise<void> {
		await this.utilitiesAggregateService.services.exceptionHandler.executeExceptionHandledOperation({
			operation: async () => {
				const customerConnectionIds = connectedCustomers.map((connectedCustomer: IConnectedCustomer) => connectedCustomer.connectionIds).flat();

				this.dispatcherService.dispatchMessage(CustomerNotificationEvents.OutgoingAgentNotification, this.server, customerConnectionIds);
			},
		});
	}
}
