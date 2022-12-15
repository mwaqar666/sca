import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/sequelize";
import { BaseRepository, type EntityScope, type EntityType } from "@sca/db";
import type { Transaction } from "sequelize";
import { ProjectDefaultEntity } from "./project-default.entity";

@Injectable()
export class ProjectDefaultRepository extends BaseRepository<ProjectDefaultEntity> {
	public constructor(
		// Dependencies

		@InjectModel(ProjectDefaultEntity) private readonly projectDefaultEntity: EntityType<ProjectDefaultEntity>,
	) {
		super(projectDefaultEntity);
	}

	public async findOrCreateUserDefaultProjectConnection(userId: number, projectId: number, scopes: EntityScope, transaction: Transaction): Promise<ProjectDefaultEntity> {
		return await this.findOrCreateEntity({
			scopes,
			findOptions: { where: { projectDefaultUserId: userId } },
			valuesToCreate: { projectDefaultUserId: userId, projectDefaultProjectId: projectId },
			transaction,
		});
	}
}
