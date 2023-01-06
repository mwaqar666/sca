import { Inject, Injectable } from "@nestjs/common";
import type { AggregateService } from "@sca-backend/aggregate";
import type { RunningTransaction } from "@sca-backend/db";
import { DomainExtensionsAggregateConst } from "../../../const";
import type { ILinkUserProject } from "../../../interfaces";
import type { IDomainExtensionsAggregate } from "../../../types";
import type { ProjectUserEntity } from "../entities";
import { ProjectUserRepository } from "../repositories";

@Injectable()
export class ProjectUserService {
	public constructor(
		// Dependencies

		private readonly projectUserRepository: ProjectUserRepository,
		@Inject(DomainExtensionsAggregateConst) private readonly extensionsAggregateService: AggregateService<IDomainExtensionsAggregate>,
	) {}

	public async findAllProjectsForUser(userId: number): Promise<Array<ProjectUserEntity>> {
		return await this.projectUserRepository.findAllProjectsForUser(userId);
	}

	public async linkProjectToUser(linkUserProjectDto: ILinkUserProject, withTransaction?: RunningTransaction): Promise<ProjectUserEntity> {
		return await this.extensionsAggregateService.services.sequelize.executeTransactionalOperation({
			withTransaction,
			transactionCallback: async (runningTransaction: RunningTransaction) => {
				return await this.projectUserRepository.createEntity({
					transaction: runningTransaction.currentTransaction.transaction,
					valuesToCreate: {
						projectUserUserId: linkUserProjectDto.userId,
						projectUserProjectId: linkUserProjectDto.projectId,
						projectUserParentId: linkUserProjectDto.projectUserParentId ?? null,
						projectUserIsDefault: !!linkUserProjectDto.projectIsDefault,
					},
				});
			},
		});
	}
}
