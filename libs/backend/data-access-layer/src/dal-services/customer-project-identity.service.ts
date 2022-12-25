import { Inject, Injectable } from "@nestjs/common";
import type { AggregateService } from "@sca-backend/aggregate";
import type { RunningTransaction } from "@sca-backend/db";
import type { IHandleCustomerRequest } from "@sca-shared/dto";
import { DomainExtensionsAggregateConst } from "../const";
import { type CustomerEntity, CustomerService, type ICustomerIpInfo, ProjectCustomerService, ProjectService } from "../domains";
import type { IDomainExtensionsAggregate } from "../types";

@Injectable()
export class CustomerProjectIdentityService {
	public constructor(
		// Dependencies

		private readonly projectService: ProjectService,
		private readonly customerService: CustomerService,
		private readonly projectCustomerService: ProjectCustomerService,
		@Inject(DomainExtensionsAggregateConst) private readonly extensionsAggregateService: AggregateService<IDomainExtensionsAggregate>,
	) {}

	public async findOrCreateAndAssociateCustomerWithProject(customerIpInfo: ICustomerIpInfo, handleCustomerRequest: IHandleCustomerRequest): Promise<CustomerEntity> {
		return this.extensionsAggregateService.services.sequelize.executeTransactionalOperation({
			transactionCallback: async (runningTransaction: RunningTransaction) => {
				const project = await this.projectService.findProjectUsingDomain(handleCustomerRequest.projectDomain);
				const customer = await this.customerService.createOrUpdateCustomerWithIpDetails(handleCustomerRequest.customerCookie, customerIpInfo, runningTransaction);
				const projectCustomer = await this.projectCustomerService.persistProjectCustomerConnection(project.projectId, customer.customerId, runningTransaction);

				projectCustomer.projectCustomerProject = project;
				customer.customerCurrentProject = projectCustomer;

				return customer;
			},
		});
	}
}
