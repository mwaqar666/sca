import { Inject, Injectable } from "@nestjs/common";
import { SocketService } from "@sca-backend/socket";
import { CustomerUtilitiesAggregateConst } from "../../const";
import type { ICustomerUtilitiesAggregate } from "../../types";
import type { AggregateService } from "@sca-backend/aggregate";
import { ConnectedAgentService, ConnectedCustomerService } from "@sca-backend/data-access-layer";
import type { IncomingCustomerRequestDto, IncomingCustomerResponseDto } from "@sca-shared/dto";
import { AuthCustomer, type AuthCustomerSocket } from "@sca-backend/auth";
import { type CustomerExpiryDto, SocketBusMessages, SocketBusService } from "@sca-backend/service-bus";
import type { Socket } from "socket.io";

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

		this.listenForServiceBusMessages();
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

	public async handleOutgoingConnection(socket: Socket): Promise<void> {
		return await this.utilitiesAggregateService.services.exceptionHandler.executeExceptionHandledOperation({
			operation: async () => {
				const customerDisconnection = await this.connectedCustomerService.disconnectAndTrackCustomer(socket.id);
				if (customerDisconnection.status !== "ExpiryAdded") return;

				/**
				 * =====================================
				 * !!! Disclaimer: Memory Leak Ahead !!!
				 * =====================================
				 * This subscriber runs when the customer gets expired after the passage
				 * of reconnecting threshold time, and then unsubscribes itself due to the
				 * presence of "first()" operator. In the case, where customer reconnects
				 * in threshold time, this subscriber will never be called and will remain
				 * hanging for the rest of application life-cycle. This needs to be fixed
				 * on high priority.
				 */
				customerDisconnection.postExpiryTasks.subscribe(async () => {
					const { entity } = customerDisconnection;
					const { customerUuid, projectUuid, agentUuid, trackingNumber } = entity;

					await this.socketBusService.publishMessage<CustomerExpiryDto>(SocketBusMessages.CustomerRemoved, { customerUuid, projectUuid, agentUuid, trackingNumber });
				});
			},
		});
	}

	private listenForServiceBusMessages(): void {
		this.socketBusService.listenForMessage<CustomerExpiryDto>(SocketBusMessages.CustomerRemoved).subscribe(this.postCustomerConnectionRemovalTasks.bind(this));
	}

	private async postCustomerConnectionRemovalTasks(customerExpiryDto: CustomerExpiryDto): Promise<void> {
		return await this.utilitiesAggregateService.services.exceptionHandler.executeExceptionHandledOperation({
			operation: async () => {
				return await this.connectedCustomerService.finishCustomerConversationsAndTrackers(customerExpiryDto);
			},
		});
	}
}
