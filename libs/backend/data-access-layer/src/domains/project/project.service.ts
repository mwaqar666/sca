import { Inject, Injectable } from "@nestjs/common";
import type { AggregateService } from "@sca-backend/aggregate";
import type { EntityTableColumnProperties, RunningTransaction } from "@sca-backend/db";
import { DomainAggregateConst } from "../../const";
import type { IDomainAggregate } from "../../types";
import type { ProjectEntity } from "./project.entity";
import { ProjectRepository } from "./project.repository";

@Injectable()
export class ProjectService {
	public constructor(
		// Dependencies

		private readonly projectRepository: ProjectRepository,
		@Inject(DomainAggregateConst) private readonly aggregateService: AggregateService<IDomainAggregate>,
	) {}

	public async createProject(createProjectData: Partial<EntityTableColumnProperties<ProjectEntity>>, withTransaction?: RunningTransaction): Promise<ProjectEntity> {
		return await this.aggregateService.services.sequelize.executeTransactionalOperation({
			withTransaction,
			transactionCallback: async (runningTransaction: RunningTransaction) => {
				return await this.projectRepository.createEntity({
					transaction: runningTransaction.currentTransaction.transaction,
					valuesToCreate: createProjectData,
				});
			},
		});
	}
}
