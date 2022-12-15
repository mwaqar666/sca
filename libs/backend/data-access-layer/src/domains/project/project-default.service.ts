import { Inject, Injectable } from "@nestjs/common";
import { AggregateService } from "@sca/aggregate";
import type { RunningTransaction } from "@sca/db";
import { SequelizeScopeConst } from "@sca/db";
import { DomainAggregateConst } from "../../const";
import type { IDomainAggregate } from "../../types";
import type { ProjectDefaultEntity } from "./project-default.entity";
import { ProjectDefaultRepository } from "./project-default.repository";

@Injectable()
export class ProjectDefaultService {
	public constructor(
		// Dependencies

		private readonly projectDefaultRepository: ProjectDefaultRepository,
		@Inject(DomainAggregateConst) private readonly aggregateService: AggregateService<IDomainAggregate>,
	) {}

	public async findOrCreateUserDefaultProjectConnection(userId: number, projectId: number, withTransaction?: RunningTransaction): Promise<ProjectDefaultEntity> {
		return await this.aggregateService.services.sequelize.executeTransactionalOperation({
			withTransaction: withTransaction,
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
}
