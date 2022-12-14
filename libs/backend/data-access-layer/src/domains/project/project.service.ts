import { Injectable } from "@nestjs/common";
import { type EntityScope, SequelizeScopeConst } from "@sca/db";
import { type ProjectEntity } from "./project.entity";
import { ProjectRepository } from "./project.repository";

@Injectable()
export class ProjectService {
	public constructor(
		// Dependencies

		private readonly projectRepository: ProjectRepository,
	) {}

	public async findUserProjects(projectUserId: number, ...scopes: EntityScope): Promise<Array<ProjectEntity>> {
		return await this.projectRepository.findEntities({
			scopes: [SequelizeScopeConst.isActive, ...scopes],
			findOptions: { where: { projectUserId, projectIsDefault: true } },
		});
	}
}
