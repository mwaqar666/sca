import { Inject, Injectable } from "@nestjs/common";
import type { AggregateService } from "@sca-backend/aggregate";
import type { EntityTableColumnProperties, RunningTransaction } from "@sca-backend/db";
import { DomainExtensionsAggregateConst } from "../../../const";
import type { IDomainExtensionsAggregate } from "../../../types";
import type { ProjectCustomerEntity } from "../entities";
import { ProjectCustomerRepository } from "../repositories";

@Injectable()
export class ProjectCustomerService {
	public constructor(
		// Dependencies

		private readonly projectCustomerRepository: ProjectCustomerRepository,
		@Inject(DomainExtensionsAggregateConst) private readonly extensionsAggregateService: AggregateService<IDomainExtensionsAggregate>,
	) {}

	public async findAllProjectsForCustomer(customerId: number): Promise<Array<ProjectCustomerEntity>> {
		return await this.projectCustomerRepository.findAllProjectsForCustomer(customerId);
	}

	public async persistProjectCustomerConnection(projectId: number, customerId: number, withTransaction?: RunningTransaction): Promise<ProjectCustomerEntity> {
		return await this.extensionsAggregateService.services.sequelize.executeTransactionalOperation({
			withTransaction,
			transactionCallback: async (runningTransaction: RunningTransaction) => {
				const findOrCreateValues: Partial<EntityTableColumnProperties<ProjectCustomerEntity>> = { projectCustomerProjectId: projectId, projectCustomerCustomerId: customerId };

				return await this.projectCustomerRepository.findOrCreateEntity({
					findOptions: { where: findOrCreateValues },
					valuesToCreate: findOrCreateValues,
					transaction: runningTransaction.currentTransaction.transaction,
				});
			},
		});
	}
}
