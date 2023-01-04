import { Inject, Injectable } from "@nestjs/common";
import { CustomerUtilitiesAggregateConst } from "../../const";
import { DispatcherService, SocketService } from "@sca-backend/socket";
import type { ICustomerUtilitiesAggregate } from "../../types";
import type { AggregateService } from "@sca-backend/aggregate";
import { type ConnectedCustomerDto, ConnectedCustomerService } from "@sca-backend/data-access-layer";
import { SocketBusMessages, SocketBusService } from "@sca-backend/service-bus";
import { OutgoingAgent } from "@sca-shared/dto";

@Injectable()
export class CustomerNotificationService extends SocketService {
	public constructor(
		// Dependencies

		private readonly socketBusService: SocketBusService,
		private readonly dispatcherService: DispatcherService,
		private readonly connectedCustomerService: ConnectedCustomerService,
		@Inject(CustomerUtilitiesAggregateConst) private readonly utilitiesAggregateService: AggregateService<ICustomerUtilitiesAggregate>,
	) {
		super();

		this.listenForServiceBusMessages();
	}

	private listenForServiceBusMessages(): void {
		this.socketBusService
			.listenForMessage<Array<ConnectedCustomerDto>>(SocketBusMessages.FreeCustomersNotificationToCustomers)
			.subscribe(this.sendReleasedCustomersNotificationToCustomers.bind(this));
	}

	private async sendReleasedCustomersNotificationToCustomers(connectedCustomers: Array<ConnectedCustomerDto>): Promise<void> {
		await this.utilitiesAggregateService.services.exceptionHandler.executeExceptionHandledOperation({
			operation: async () => {
				const customerConnectionIds = connectedCustomers.map((connectedCustomer: ConnectedCustomerDto) => connectedCustomer.connectionIds).flat();

				this.dispatcherService.dispatchMessage(OutgoingAgent, this.server, customerConnectionIds);
			},
		});
	}
}
