import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/sequelize";
import { BaseRepository, type EntityType } from "@sca-backend/db";
import { ProjectCustomerEntity } from "../entities";

@Injectable()
export class ProjectCustomerRepository extends BaseRepository<ProjectCustomerEntity> {
	public constructor(
		// Dependencies

		@InjectModel(ProjectCustomerEntity) private readonly projectCustomerEntity: EntityType<ProjectCustomerEntity>,
	) {
		super(projectCustomerEntity);
	}
}
