import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/sequelize";
import { BaseRepository, type EntityScope, type EntityType } from "@sca/db";
import { ProjectUserEntity } from "./project-user.entity";
import { ProjectEntity } from "./project.entity";

@Injectable()
export class ProjectUserRepository extends BaseRepository<ProjectUserEntity> {
	public constructor(
		// Dependencies

		@InjectModel(ProjectUserEntity) private readonly projectUserEntity: EntityType<ProjectUserEntity>,
		@InjectModel(ProjectEntity) private readonly projectEntity: EntityType<ProjectEntity>,
	) {
		super(projectUserEntity);
	}

	public async findAllProjectsForUser(userId: number, ...scopes: EntityScope): Promise<Array<ProjectUserEntity>> {
		return await this.findEntities({
			scopes,
			findOptions: {
				where: { projectUserUserId: userId },
				include: [
					{
						required: true,
						as: "projectUserProject",
						model: this.projectEntity.applyScopes(scopes),
					},
				],
			},
		});
	}
}
