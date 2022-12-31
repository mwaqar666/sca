import { Inject, Injectable } from "@nestjs/common";
import type { Server } from "socket.io";
import { CustomerUtilitiesAggregateConst } from "../../const";
import { SocketService } from "@sca-backend/socket";
import type { ICustomerUtilitiesAggregate } from "../../types";
import type { AggregateService } from "@sca-backend/aggregate";
import type { CustomerEntity } from "@sca-backend/data-access-layer";
import { ConnectedCustomerService } from "@sca-backend/data-access-layer";

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

	public async handleIncomingConnection(customer: CustomerEntity, customerConnectionId: string) /*Promise<IEntityConnectionStatus<CustomerRedisEntity>>*/ {
		// return await this.utilitiesAggregateService.services.exceptionHandler.executeExceptionHandledOperation({
		// 	operation: async () => {
		// 		const [projectUuid, customerUuid] = [customer.customerCurrentProject.projectCustomerProject.projectUuid, customer.customerUuid];
		//
		// 		const customerPresence = await this.customerRedisRepository.tryReconnectingCustomer(customerUuid, customerConnectionId);
		//
		// 		if (customerPresence.entityStatus !== "Absent") return customerPresence;
		//
		// 		const customerConnected = await this.customerRedisRepository.addCustomerInstanceInConnection({ customerUuid, projectUuid, customerConnectionId });
		//
		// 		return { entity: customerConnected, entityStatus: "Created" };
		// 	},
		// });
	}
}
