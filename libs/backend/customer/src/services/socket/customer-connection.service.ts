import type { Server } from "socket.io";
import { Inject, Injectable } from "@nestjs/common";
import { SocketService } from "@sca-backend/socket";
import { CustomerUtilitiesAggregateConst } from "../../const";
import type { ICustomerUtilitiesAggregate } from "../../types";
import type { AggregateService } from "@sca-backend/aggregate";
import { ConnectedCustomerService, type CustomerEntity } from "@sca-backend/data-access-layer";
import type { HandleIncomingCustomerPayloadDto } from "@sca-shared/dto";

@Injectable()
export class CustomerConnectionService extends SocketService {
	public constructor(
		// Dependencies

		private readonly connectedCustomerService: ConnectedCustomerService,
		@Inject(CustomerUtilitiesAggregateConst) private readonly utilitiesAggregateService: AggregateService<ICustomerUtilitiesAggregate>,
	) {
		super();
	}

	public override setServer(server: Server): void {
		this.server = server;
	}

	public async handleIncomingConnection(customer: CustomerEntity, connectionId: string, customerPayloadDto: HandleIncomingCustomerPayloadDto): Promise<void> {
		await this.utilitiesAggregateService.services.exceptionHandler.executeExceptionHandledOperation({
			operation: async () => {
				return await this.connectedCustomerService.connectAndTrackCustomer(customer, connectionId, customerPayloadDto);
			},
		});
	}
}
