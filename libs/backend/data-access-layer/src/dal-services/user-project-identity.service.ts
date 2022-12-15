import { Injectable } from "@nestjs/common";
import { SequelizeScopeConst } from "@sca/db";
import type { ProjectUserSignInRequestDto } from "@sca/dto";
import { ProjectDefaultService, type ProjectUserEntity, ProjectUserService, UserService } from "../domains";
import type { FailedAuthReasonProject, FailedAuthReasonUser, SuccessfulAuthWithUserAndProject } from "../dto";

@Injectable()
export class UserProjectIdentityService {
	public constructor(
		// Dependencies

		private readonly userService: UserService,
		private readonly projectUserService: ProjectUserService,
		private readonly projectDefaultService: ProjectDefaultService,
	) {}

	public async authenticateProjectUserWithAllAndDefaultProjects(
		projectUserSignInRequestDto: ProjectUserSignInRequestDto,
	): Promise<FailedAuthReasonUser | FailedAuthReasonProject | SuccessfulAuthWithUserAndProject> {
		const user = await this.userService.findUser(projectUserSignInRequestDto.userEmail, SequelizeScopeConst.withoutTimestamps);
		if (!user) return { authUser: null, authErrorReason: "user" };

		const projectUsers = await this.projectUserService.findAllProjectsForUser(user.userId, SequelizeScopeConst.withoutTimestamps);
		if (projectUsers.length === 0) return { authUser: null, authErrorReason: "project" };

		const userDefaultProjectConnection = await this.projectDefaultService.findOrCreateUserDefaultProjectConnection(user.userId, projectUsers[0].projectUserProjectId);

		const defaultProjectIndex = projectUsers.findIndex((project: ProjectUserEntity) => project.projectUserProjectId === userDefaultProjectConnection.projectDefaultProjectId);
		userDefaultProjectConnection.projectDefaultProject = projectUsers[defaultProjectIndex].projectUserProject;
		const userNonDefaultProjects = projectUsers.slice(0, defaultProjectIndex).concat(projectUsers.slice(defaultProjectIndex + 1));

		user.userDefaultProject = userDefaultProjectConnection;
		user.userProjects = userNonDefaultProjects;

		return { authUser: user, authErrorReason: null };
	}
}
