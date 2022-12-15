import { Injectable } from "@nestjs/common";
import { EntityScope } from "@sca/db";
import type { ProjectUserEntity } from "./project-user.entity";
import { ProjectUserRepository } from "./project-user.repository";

@Injectable()
export class ProjectUserService {
	public constructor(
		// Dependencies

		private readonly projectUserRepository: ProjectUserRepository,
	) {}

	public async findAllProjectsForUser(userId: number, ...scopes: EntityScope): Promise<Array<ProjectUserEntity>> {
		return await this.projectUserRepository.findAllProjectsForUser(userId, ...scopes);
	}
}
