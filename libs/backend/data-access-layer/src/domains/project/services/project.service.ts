import { Inject, Injectable } from "@nestjs/common";
import type { AggregateService } from "@sca-backend/aggregate";
import type { EntityTableColumnProperties, RunningTransaction } from "@sca-backend/db";
import { SequelizeScopeConst } from "@sca-backend/db";
import { DomainExtensionsAggregateConst } from "../../../const";
import type { IDomainExtensionsAggregate } from "../../../types";
import type { ProjectEntity } from "../entities";
import { ProjectRepository } from "../repositories";

@Injectable()
export class ProjectService {
	public constructor(
		// Dependencies

		private readonly projectRepository: ProjectRepository,
		@Inject(DomainExtensionsAggregateConst) private readonly extensionsAggregateService: AggregateService<IDomainExtensionsAggregate>,
	) {}

	public async findProjectUsingDomain(projectDomain: string): Promise<ProjectEntity> {
		return await this.projectRepository.findOrFailEntity({
			findOptions: { where: { projectDomain } },
			scopes: [SequelizeScopeConst.withoutTimestamps],
		});
	}

	public async createProject(createProjectData: Partial<EntityTableColumnProperties<ProjectEntity>>, withTransaction?: RunningTransaction): Promise<ProjectEntity> {
		return await this.extensionsAggregateService.services.sequelize.executeTransactionalOperation({
			withTransaction,
			transactionCallback: async (runningTransaction: RunningTransaction) => {
				return await this.projectRepository.createSingleEntity({
					transaction: runningTransaction.currentTransaction.transaction,
					valuesToCreate: createProjectData,
				});
			},
		});
	}
}
