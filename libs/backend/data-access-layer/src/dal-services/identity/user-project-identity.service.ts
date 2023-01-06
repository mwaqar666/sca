import { Inject, Injectable } from "@nestjs/common";
import type { AggregateService } from "@sca-backend/aggregate";
import type { RunningTransaction } from "@sca-backend/db";
import type { ISignUpRequest } from "@sca-shared/dto";
import { UserTypeEnum } from "@sca-shared/dto";
import { DomainExtensionsAggregateConst } from "../../const";
import { ProjectService, type ProjectUserEntity, ProjectUserService, type UserEntity, UserService, UserTypeService } from "../../domains";
import type { IFailedAuthReasonProject, IFailedAuthReasonUser, ISuccessfulAuthWithUserAndProject } from "../../interfaces";
import type { IDomainExtensionsAggregate } from "../../types";

@Injectable()
export class UserProjectIdentityService {
	public constructor(
		// Dependencies

		private readonly userService: UserService,
		private readonly userTypeService: UserTypeService,
		private readonly projectService: ProjectService,
		private readonly projectUserService: ProjectUserService,
		@Inject(DomainExtensionsAggregateConst) private readonly extensionsAggregateService: AggregateService<IDomainExtensionsAggregate>,
	) {}

	public async authenticateUserUsingEmailWithAllAndCurrentProjects(userEmail: string): Promise<IFailedAuthReasonUser | IFailedAuthReasonProject | ISuccessfulAuthWithUserAndProject> {
		const user = await this.userService.findUserUsingEmail(userEmail);
		if (!user) return { authEntity: null, authErrorReason: "user" };

		return await this.authenticateUserWithAllAndCurrentProjects(user);
	}

	public async authenticateUserUsingUuidWithAllAndCurrentProjects(
		userUuid: string,
		projectUuid: string,
	): Promise<IFailedAuthReasonUser | IFailedAuthReasonProject | ISuccessfulAuthWithUserAndProject> {
		const user = await this.userService.findUserUsingUuid(userUuid);
		if (!user) return { authEntity: null, authErrorReason: "user" };

		return await this.authenticateUserWithAllAndCurrentProjects(user, projectUuid);
	}

	public async registerUserWithProject(signUpRequest: ISignUpRequest): Promise<UserEntity> {
		return await this.extensionsAggregateService.services.sequelize.executeTransactionalOperation({
			transactionCallback: async (runningTransaction: RunningTransaction) => {
				const userType = await this.userTypeService.findUserType(UserTypeEnum.ProjectUsers);
				const user = await this.userService.createUser(signUpRequest, userType.userTypeId, runningTransaction);
				const project = await this.projectService.createProject(signUpRequest, runningTransaction);
				const projectUser = await this.projectUserService.linkProjectToUser({ userId: user.userId, projectId: project.projectId, projectIsDefault: true }, runningTransaction);

				projectUser.projectUserProject = project;
				projectUser.projectUserUser = user;

				user.userProjects = [projectUser];
				user.userCurrentProject = projectUser;

				return user;
			},
		});
	}

	private async authenticateUserWithAllAndCurrentProjects(user: UserEntity): Promise<IFailedAuthReasonUser | IFailedAuthReasonProject | ISuccessfulAuthWithUserAndProject>;
	private async authenticateUserWithAllAndCurrentProjects(user: UserEntity, projectUuid: string): Promise<IFailedAuthReasonUser | IFailedAuthReasonProject | ISuccessfulAuthWithUserAndProject>;
	private async authenticateUserWithAllAndCurrentProjects(user: UserEntity, projectUuid?: string): Promise<IFailedAuthReasonUser | IFailedAuthReasonProject | ISuccessfulAuthWithUserAndProject> {
		let userCurrentProjectIndex = -1;

		const projectUsersWithProjects = await this.projectUserService.findAllProjectsForUser(user.userId);
		if (projectUsersWithProjects.length === 0) return { authEntity: null, authErrorReason: "project" };
		projectUsersWithProjects.forEach((projectUser: ProjectUserEntity) => (projectUser.projectUserUser = user));

		if (projectUuid) {
			userCurrentProjectIndex = projectUsersWithProjects.findIndex((projectUser: ProjectUserEntity) => projectUser.projectUserProject.projectUuid === projectUuid);
			if (userCurrentProjectIndex === -1) return { authEntity: null, authErrorReason: "project" };
		}

		if (userCurrentProjectIndex === -1) userCurrentProjectIndex = projectUsersWithProjects.findIndex((projectUser: ProjectUserEntity) => projectUser.projectUserIsDefault);

		user.userProjects = projectUsersWithProjects;
		user.userCurrentProject = projectUsersWithProjects[userCurrentProjectIndex];

		return { authEntity: user, authErrorReason: null };
	}
}
