import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/sequelize";
import { BaseRepository, type EntityType, SequelizeScopeConst } from "@sca-backend/db";
import { ProjectCustomerEntity, ProjectEntity } from "../entities";

@Injectable()
export class ProjectCustomerRepository extends BaseRepository<ProjectCustomerEntity> {
	public constructor(
		// Dependencies

		@InjectModel(ProjectCustomerEntity) private readonly projectCustomerEntity: EntityType<ProjectCustomerEntity>,
		@InjectModel(ProjectEntity) private readonly projectEntity: EntityType<ProjectEntity>,
	) {
		super(projectCustomerEntity);
	}

	public async findAllProjectsForCustomer(customerId: number): Promise<Array<ProjectCustomerEntity>> {
		return await this.findEntities({
			scopes: [SequelizeScopeConst.withoutTimestamps],
			findOptions: {
				where: { projectCustomerCustomerId: customerId },
				include: {
					required: true,
					as: "projectCustomerProject",
					model: this.projectEntity.applyScopes([SequelizeScopeConst.withoutTimestamps]),
				},
			},
		});
	}
}
