import { Inject, Injectable } from "@nestjs/common";
import type { AggregateService } from "@sca-backend/aggregate";
import type { EntityScope, RunningTransaction } from "@sca-backend/db";
import { DomainExtensionsAggregateConst } from "../../const";
import type { LinkUserProjectDto } from "../../dto";
import type { IDomainExtensionsAggregate } from "../../types";
import type { ProjectUserEntity } from "./project-user.entity";
import { ProjectUserRepository } from "./project-user.repository";

@Injectable()
export class ProjectUserService {
	public constructor(
		// Dependencies

		private readonly projectUserRepository: ProjectUserRepository,
		@Inject(DomainExtensionsAggregateConst) private readonly aggregateService: AggregateService<IDomainExtensionsAggregate>,
	) {}

	public async findAllProjectsForUser(userId: number, ...scopes: EntityScope): Promise<Array<ProjectUserEntity>> {
		return await this.projectUserRepository.findAllProjectsForUser(userId, ...scopes);
	}

	public async linkProjectToUser(linkUserProjectDto: LinkUserProjectDto, withTransaction?: RunningTransaction): Promise<ProjectUserEntity> {
		return await this.aggregateService.services.sequelize.executeTransactionalOperation({
			withTransaction,
			transactionCallback: async (runningTransaction: RunningTransaction) => {
				return await this.projectUserRepository.createEntity({
					transaction: runningTransaction.currentTransaction.transaction,
					valuesToCreate: {
						projectUserUserId: linkUserProjectDto.userId,
						projectUserProjectId: linkUserProjectDto.projectId,
						projectUserParentId: linkUserProjectDto.projectUserParentId ?? null,
					},
				});
			},
		});
	}
}
