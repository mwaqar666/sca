import { Inject, Injectable } from "@nestjs/common";
import { AggregateService } from "@sca-backend/aggregate";
import type { RunningTransaction } from "@sca-backend/db";
import type { Nullable } from "@sca-shared/utils";
import { DomainExtensionsAggregateConst, DomainUtilitiesAggregateConst } from "../../../const";
import type { IDomainExtensionsAggregate, IDomainUtilitiesAggregate } from "../../../types";
import type { CustomerIdentifierEntity } from "../entities";
import { CustomerIdentifierRepository } from "../repositories";

@Injectable()
export class CustomerIdentifierService {
	public constructor(
		// Dependencies

		private readonly customerIdentifierRepository: CustomerIdentifierRepository,
		@Inject(DomainExtensionsAggregateConst) private readonly extensionsAggregateService: AggregateService<IDomainExtensionsAggregate>,
		@Inject(DomainUtilitiesAggregateConst) private readonly utilitiesAggregateService: AggregateService<IDomainUtilitiesAggregate>,
	) {}

	public async findOrCreateCustomerIdentifierByCookieThenIp(ipValue: string, cookieValue: Nullable<string>, withTransaction?: RunningTransaction): Promise<CustomerIdentifierEntity> {
		return await this.extensionsAggregateService.services.sequelize.executeTransactionalOperation({
			withTransaction,
			transactionCallback: async (runningTransaction: RunningTransaction) => {
				if (cookieValue) {
					const customerIdentifier = await this.customerIdentifierRepository.findCustomerIdentifierByCookie(cookieValue);
					if (customerIdentifier) return customerIdentifier;
				}

				const customerIdentifier = await this.customerIdentifierRepository.findCustomerIdentifierByIp(ipValue);
				if (customerIdentifier) return customerIdentifier;

				if (!cookieValue) cookieValue = this.utilitiesAggregateService.services.uuid.createUuid();
				return await this.customerIdentifierRepository.createCustomerIdentifier(
					{ customerIdentifierCookie: cookieValue, customerIdentifierIp: ipValue },
					runningTransaction.currentTransaction.transaction,
				);
			},
		});
	}
}
