import { Inject, Injectable } from "@nestjs/common";
import type { AggregateService } from "@sca-backend/aggregate";
import type { RunningTransaction } from "@sca-backend/db";
import type { ICustomerIpInfo, IHandleCustomerRequest } from "@sca-shared/dto";
import { DomainExtensionsAggregateConst } from "../../const";
import { type CustomerEntity, CustomerService, type ProjectCustomerEntity, ProjectCustomerService, ProjectService } from "../../domains";
import type { FailedAuthReasonCustomer, FailedAuthReasonProject, SuccessfulAuthWithCustomerAndProject } from "../../dto";
import type { IDomainExtensionsAggregate } from "../../types";

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
				projectCustomer.projectCustomerCustomer = customer;

				customer.customerCurrentProject = projectCustomer;

				return customer;
			},
		});
	}

	public async authenticateCustomerWithUuidWithAllProjects(
		customerUuid: string,
		projectUuid: string,
	): Promise<FailedAuthReasonCustomer | FailedAuthReasonProject | SuccessfulAuthWithCustomerAndProject> {
		const customer = await this.customerService.findCustomerUsingUuid(customerUuid);
		if (!customer) return { authEntity: null, authErrorReason: "customer" };

		const projectCustomersWithProjects = await this.projectCustomerService.findAllProjectsForCustomer(customer.customerId);
		if (projectCustomersWithProjects.length === 0) return { authEntity: null, authErrorReason: "project" };
		projectCustomersWithProjects.forEach((projectCustomer: ProjectCustomerEntity) => (projectCustomer.projectCustomerCustomer = customer));

		const currentProjectCustomerIndex = projectCustomersWithProjects.findIndex((projectCustomer: ProjectCustomerEntity) => projectCustomer.projectCustomerProject.projectUuid === projectUuid);
		if (currentProjectCustomerIndex === -1) return { authEntity: null, authErrorReason: "project" };

		customer.customerCurrentProject = projectCustomersWithProjects[currentProjectCustomerIndex];
		customer.customerProjects = projectCustomersWithProjects;

		return { authEntity: customer, authErrorReason: null };
	}
}
