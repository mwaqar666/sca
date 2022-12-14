import { Injectable } from "@nestjs/common";
import { SequelizeScopeConst } from "@sca/db";
import type { SignInRequestDto } from "@sca/dto";
import type { Nullable } from "@sca/utils";
import { type ProjectEntity, ProjectService, type UserEntity, UserService } from "../domains";

@Injectable()
export class UserProjectIdentityService {
	public constructor(
		// Dependencies

		private readonly userService: UserService,
		private readonly projectService: ProjectService,
	) {}

	public async authenticateUserWithAllAndDefaultProjects(signInRequestDto: SignInRequestDto): Promise<Nullable<UserEntity>> {
		const user = await this.userService.findUser(signInRequestDto.userEmail, SequelizeScopeConst.withoutTimestamps);
		if (!user) return null;

		const projects = await this.projectService.findUserProjects(user.userId, SequelizeScopeConst.withoutTimestamps);
		const defaultProjectIndex = projects.findIndex((project: ProjectEntity) => project.projectIsDefault);
		if (projects.length === 0 || defaultProjectIndex === -1) return null;

		user.userDefaultProject = projects[defaultProjectIndex];
		projects.splice(defaultProjectIndex, 1);
		user.userProjects = projects;

		return user;
	}
}
