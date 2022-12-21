import { Inject, Injectable } from "@nestjs/common";
import type { AggregateService } from "@sca-backend/aggregate";
import type { RunningTransaction } from "@sca-backend/db";
import { SequelizeScopeConst } from "@sca-backend/db";
import { DomainExtensionsAggregateConst } from "../../const";
import type { IDomainExtensionsAggregate } from "../../types";
import type { UserEntity } from "../user";
import type { ProjectDefaultEntity } from "./project-default.entity";
import { ProjectDefaultRepository } from "./project-default.repository";
import type { ProjectEntity } from "./project.entity";

@Injectable()
export class ProjectDefaultService {
	public constructor(
		// Dependencies

		private readonly projectDefaultRepository: ProjectDefaultRepository,
		@Inject(DomainExtensionsAggregateConst) private readonly aggregateService: AggregateService<IDomainExtensionsAggregate>,
	) {}

	public async findOrCreateUserDefaultProjectConnection(userId: number, projectId: number, withTransaction?: RunningTransaction): Promise<ProjectDefaultEntity> {
		return await this.aggregateService.services.sequelize.executeTransactionalOperation({
			withTransaction,
			transactionCallback: async (runningTransaction: RunningTransaction) => {
				return await this.projectDefaultRepository.findOrCreateUserDefaultProjectConnection(
					userId,
					projectId,
					[SequelizeScopeConst.withoutTimestamps],
					runningTransaction.currentTransaction.transaction,
				);
			},
		});
	}

	public async createUserDefaultProject(user: UserEntity, defaultProject: ProjectEntity, withTransaction?: RunningTransaction): Promise<ProjectDefaultEntity> {
		return await this.aggregateService.services.sequelize.executeTransactionalOperation({
			withTransaction,
			transactionCallback: async (runningTransaction: RunningTransaction) => {
				return await this.projectDefaultRepository.createEntity({
					transaction: runningTransaction.currentTransaction.transaction,
					valuesToCreate: {
						projectDefaultUserId: user.userId,
						projectDefaultProjectId: defaultProject.projectId,
					},
				});
			},
		});
	}
}
