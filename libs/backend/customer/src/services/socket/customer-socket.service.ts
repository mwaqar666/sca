import { Inject, Injectable } from "@nestjs/common";
import { AuthCustomer, type AuthCustomerSocket } from "@sca-backend/auth";
import type { Server } from "socket.io";
import { CustomerConnectionService } from "./customer-connection.service";
import { CustomerUtilitiesAggregateConst } from "../../const";
import type { HandleIncomingCustomerPayloadDto } from "@sca-shared/dto";
import { SocketService } from "@sca-backend/socket";
import type { ICustomerUtilitiesAggregate } from "../../types";
import type { AggregateService } from "@sca-backend/aggregate";

@Injectable()
export class CustomerSocketService extends SocketService {
	public constructor(
		// Dependencies

		private readonly customerConnectionService: CustomerConnectionService,
		@Inject(CustomerUtilitiesAggregateConst) private readonly utilitiesAggregateService: AggregateService<ICustomerUtilitiesAggregate>,
	) {
		super();
	}

	public override setServer(server: Server): void {
		this.server = server;
		this.customerConnectionService.setServer(server);
	}

	public async connectIncomingCustomer(customerSocket: AuthCustomerSocket, handleIncomingCustomerPayloadDto: HandleIncomingCustomerPayloadDto): Promise<void> {
		await this.utilitiesAggregateService.services.exceptionHandler.executeExceptionHandledOperation({
			operation: async () => {
				const customerConnectionStatus = await this.customerConnectionService.handleIncomingConnection(customerSocket.data[AuthCustomer], customerSocket.id);
			},
		});
	}
}
