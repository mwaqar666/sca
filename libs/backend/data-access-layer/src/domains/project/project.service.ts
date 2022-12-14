import { Injectable } from "@nestjs/common";
import { SequelizeScopeConst } from "@sca/db";
import { Nullable } from "@sca/utils";
import { ProjectEntity } from "./project.entity";
import { ProjectRepository } from "./project.repository";

@Injectable()
export class ProjectService {
	public constructor(
		// Dependencies

		private readonly projectRepository: ProjectRepository,
	) {}

	public async findProject(projectUserId: number, projectDomain: string): Promise<Nullable<ProjectEntity>> {
		return await this.projectRepository.findEntity({
			scopes: [SequelizeScopeConst.isActive],
			findOptions: { where: { projectUserId, projectDomain } },
		});
	}
}
