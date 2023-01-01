import { Inject, Injectable } from "@nestjs/common";
import { SocketService } from "@sca-backend/socket";
import { CustomerUtilitiesAggregateConst } from "../../const";
import type { ICustomerUtilitiesAggregate } from "../../types";
import type { AggregateService } from "@sca-backend/aggregate";
import { ConnectedAgentService, ConnectedCustomerService } from "@sca-backend/data-access-layer";
import type { IncomingCustomerRequestDto, IncomingCustomerResponseDto } from "@sca-shared/dto";
import { AuthCustomer, type AuthCustomerSocket } from "@sca-backend/auth";
import { SocketBusMessages, SocketBusService } from "@sca-backend/service-bus";

@Injectable()
export class CustomerConnectionService extends SocketService {
	public constructor(
		// Dependencies

		private readonly socketBusService: SocketBusService,
		private readonly connectedAgentService: ConnectedAgentService,
		private readonly connectedCustomerService: ConnectedCustomerService,
		@Inject(CustomerUtilitiesAggregateConst) private readonly utilitiesAggregateService: AggregateService<ICustomerUtilitiesAggregate>,
	) {
		super();
	}

	public async handleIncomingConnection(customerSocket: AuthCustomerSocket, incomingCustomerRequestDto: IncomingCustomerRequestDto): Promise<IncomingCustomerResponseDto> {
		return await this.utilitiesAggregateService.services.exceptionHandler.executeExceptionHandledOperation({
			operation: async (): Promise<IncomingCustomerResponseDto> => {
				const authenticatedCustomer = customerSocket.data[AuthCustomer];
				const customer = await this.connectedCustomerService.connectAndTrackCustomer(authenticatedCustomer, customerSocket.id, incomingCustomerRequestDto);
				const onlineAgents = await this.connectedAgentService.onlineAgentsOfProject(authenticatedCustomer.customerCurrentProject.projectCustomerProject.projectUuid);
				const incomingCustomerResponse: IncomingCustomerResponseDto = { onlineAgents: onlineAgents.length, trackingNumber: authenticatedCustomer.customerCurrentTracker.trackerTrackingNumber };

				if (customer.status !== "Created") return incomingCustomerResponse;

				const newConnectedCustomer = this.connectedCustomerService.prepareConnectedCustomerDto(customer.entity, authenticatedCustomer);
				await this.socketBusService.publishMessage(SocketBusMessages.NotifyAllAgentsOfNewCustomer, newConnectedCustomer);

				return incomingCustomerResponse;
			},
		});
	}
}
