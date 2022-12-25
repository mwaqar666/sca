import { Inject, Injectable } from "@nestjs/common";
import type { AggregateService } from "@sca-backend/aggregate";
import type { RunningTransaction } from "@sca-backend/db";
import { SequelizeScopeConst } from "@sca-backend/db";
import type { Nullable } from "@sca-shared/utils";
import { DomainExtensionsAggregateConst, DomainUtilitiesAggregateConst } from "../../../const";
import type { IDomainExtensionsAggregate, IDomainUtilitiesAggregate } from "../../../types";
import { CustomerConst } from "../const";
import type { CustomerEntity } from "../entities";
import { CustomerRepository } from "../repositories";
import type { ICustomerIpInfo, ICustomerPersonalInfo } from "../types";

@Injectable()
export class CustomerService {
	public constructor(
		// Dependencies

		private readonly customerRepository: CustomerRepository,
		@Inject(DomainExtensionsAggregateConst) private readonly extensionsAggregateService: AggregateService<IDomainExtensionsAggregate>,
		@Inject(DomainUtilitiesAggregateConst) private readonly extensionsUtilitiesService: AggregateService<IDomainUtilitiesAggregate>,
	) {}

	public async createOrUpdateCustomerWithIpDetails(customerCookie: Nullable<string>, customerIpInfo: ICustomerIpInfo, withTransaction?: RunningTransaction): Promise<CustomerEntity> {
		return await this.extensionsAggregateService.services.sequelize.executeTransactionalOperation({
			withTransaction,
			transactionCallback: async (runningTransaction: RunningTransaction) => {
				const customerPersonalInfo = this.customerPersonalInfoOrDefault();

				if (!customerCookie) {
					customerCookie = this.extensionsUtilitiesService.services.uuid.createUuid();

					return await this.customerRepository.createCustomer(customerCookie, customerPersonalInfo, customerIpInfo, runningTransaction.currentTransaction.transaction);
				}

				return this.customerRepository.updateOrCreateCustomer(customerCookie, customerPersonalInfo, customerIpInfo, runningTransaction.currentTransaction.transaction);
			},
		});
	}

	public async findCustomerUsingUuid(customerUuid: string): Promise<Nullable<CustomerEntity>> {
		return await this.customerRepository.resolveEntity(customerUuid, [SequelizeScopeConst.isActive, SequelizeScopeConst.withoutTimestamps]);
	}

	public customerPersonalInfoOrDefault(): ICustomerPersonalInfo;
	public customerPersonalInfoOrDefault(customerPersonalInfo: Partial<ICustomerPersonalInfo>): ICustomerPersonalInfo;
	public customerPersonalInfoOrDefault(customerPersonalInfo?: Partial<ICustomerPersonalInfo>): ICustomerPersonalInfo {
		return {
			customerName: customerPersonalInfo && customerPersonalInfo.customerName ? customerPersonalInfo.customerName : CustomerConst.Anonymous,
			customerEmail: customerPersonalInfo && customerPersonalInfo.customerEmail ? customerPersonalInfo.customerEmail : CustomerConst.Anonymous,
			customerContact: customerPersonalInfo && customerPersonalInfo.customerContact ? customerPersonalInfo.customerContact : CustomerConst.Anonymous,
		};
	}
}
