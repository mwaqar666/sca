import { Inject, Injectable } from "@nestjs/common";
import { AggregateService } from "@sca-backend/aggregate";
import type { RunningTransaction } from "@sca-backend/db";
import { IHandleCustomerRequest } from "@sca-shared/dto";
import { DomainExtensionsAggregateConst } from "../const";
import { type CustomerIdentifierEntity, CustomerIdentifierService } from "../domains";
import type { IDomainExtensionsAggregate } from "../types";

@Injectable()
export class CustomerHandlerService {
	public constructor(
		// Dependencies

		private readonly customerIdentifierService: CustomerIdentifierService,
		@Inject(DomainExtensionsAggregateConst) private readonly extensionsAggregateService: AggregateService<IDomainExtensionsAggregate>,
	) {}

	public async findOrCreateCustomerIdentifierByCookieThenIp(requestIp: string, handleCustomerRequest: IHandleCustomerRequest): Promise<CustomerIdentifierEntity> {
		return this.extensionsAggregateService.services.sequelize.executeTransactionalOperation({
			transactionCallback: async (runningTransaction: RunningTransaction) => {
				return this.customerIdentifierService.findOrCreateCustomerIdentifierByCookieThenIp(requestIp, handleCustomerRequest.customerCookie, runningTransaction);
			},
		});
	}
}
