import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/sequelize";
import { BaseRepository, type EntityType, SequelizeScopeConst } from "@sca-backend/db";
import { ProjectEntity, ProjectUserEntity } from "../entities";

@Injectable()
export class ProjectUserRepository extends BaseRepository<ProjectUserEntity> {
	public constructor(
		// Dependencies

		@InjectModel(ProjectUserEntity) private readonly projectUserEntity: EntityType<ProjectUserEntity>,
		@InjectModel(ProjectEntity) private readonly projectEntity: EntityType<ProjectEntity>,
	) {
		super(projectUserEntity);
	}

	public async findAllProjectsForUser(userId: number): Promise<Array<ProjectUserEntity>> {
		return await this.findEntities({
			scopes: [SequelizeScopeConst.withoutTimestamps],
			findOptions: {
				where: { projectUserUserId: userId },
				include: [
					{
						required: true,
						as: "projectUserProject",
						model: this.projectEntity.applyScopes([SequelizeScopeConst.withoutTimestamps]),
					},
				],
			},
		});
	}
}
