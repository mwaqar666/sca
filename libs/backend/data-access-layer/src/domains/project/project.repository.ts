import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/sequelize";
import { BaseRepository, type EntityType } from "@sca-backend/db";
import { ProjectEntity } from "./project.entity";

@Injectable()
export class ProjectRepository extends BaseRepository<ProjectEntity> {
	public constructor(
		// Dependencies

		@InjectModel(ProjectEntity) private readonly projectEntity: EntityType<ProjectEntity>,
	) {
		super(projectEntity);
	}
}
