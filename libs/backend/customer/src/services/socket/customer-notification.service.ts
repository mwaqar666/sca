import { Inject, Injectable } from "@nestjs/common";
import { CustomerUtilitiesAggregateConst } from "../../const";
import { SocketService } from "@sca-backend/socket";
import type { ICustomerUtilitiesAggregate } from "../../types";
import type { AggregateService } from "@sca-backend/aggregate";
import { ConnectedCustomerService } from "@sca-backend/data-access-layer";

@Injectable()
export class CustomerNotificationService extends SocketService {
	public constructor(
		// Dependencies

		private readonly connectedCustomerService: ConnectedCustomerService,
		@Inject(CustomerUtilitiesAggregateConst) private readonly utilitiesAggregateService: AggregateService<ICustomerUtilitiesAggregate>,
	) {
		super();
	}
}
