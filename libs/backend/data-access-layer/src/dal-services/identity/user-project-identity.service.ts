import { Inject, Injectable } from "@nestjs/common";
import type { AggregateService } from "@sca-backend/aggregate";
import type { RunningTransaction } from "@sca-backend/db";
import type { ISignUpRequest } from "@sca-shared/dto";
import { UserTypeEnum } from "@sca-shared/dto";
import { DomainExtensionsAggregateConst } from "../../const";
import { ProjectDefaultService, ProjectService, type ProjectUserEntity, ProjectUserService, type UserEntity, UserService, UserTypeService } from "../../domains";
import type { FailedAuthReasonProject, FailedAuthReasonUser, SuccessfulAuthWithUserAndProject } from "../../dto";
import type { IDomainExtensionsAggregate } from "../../types";

@Injectable()
export class UserProjectIdentityService {
	public constructor(
		// Dependencies

		private readonly userService: UserService,
		private readonly userTypeService: UserTypeService,
		private readonly projectService: ProjectService,
		private readonly projectUserService: ProjectUserService,
		private readonly projectDefaultService: ProjectDefaultService,
		@Inject(DomainExtensionsAggregateConst) private readonly extensionsAggregateService: AggregateService<IDomainExtensionsAggregate>,
	) {}

	public async authenticateUserUsingEmailWithAllAndDefaultProjects(userEmail: string): Promise<FailedAuthReasonUser | FailedAuthReasonProject | SuccessfulAuthWithUserAndProject> {
		const user = await this.userService.findUserUsingEmail(userEmail);
		if (!user) return { authEntity: null, authErrorReason: "user" };

		return await this.authenticateUserWithAllAndDefaultProjects(user);
	}

	public async authenticateUserUsingUuidWithAllAndDefaultProjects(userUuid: string): Promise<FailedAuthReasonUser | FailedAuthReasonProject | SuccessfulAuthWithUserAndProject> {
		const user = await this.userService.findUserUsingUuid(userUuid);
		if (!user) return { authEntity: null, authErrorReason: "user" };

		return await this.authenticateUserWithAllAndDefaultProjects(user);
	}

	public async registerUserWithProject(signUpRequest: ISignUpRequest): Promise<UserEntity> {
		return await this.extensionsAggregateService.services.sequelize.executeTransactionalOperation({
			transactionCallback: async (runningTransaction: RunningTransaction) => {
				const userType = await this.userTypeService.findUserType(UserTypeEnum.ProjectUsers);
				const user = await this.userService.createUser(signUpRequest, userType.userTypeId, runningTransaction);
				const project = await this.projectService.createProject(signUpRequest, runningTransaction);
				const projectUser = await this.projectUserService.linkProjectToUser({ userId: user.userId, projectId: project.projectId }, runningTransaction);
				const projectDefault = await this.projectDefaultService.createUserDefaultProject(user.userId, project.projectId, runningTransaction);

				projectUser.projectUserProject = project;
				projectUser.projectUserUser = user;

				projectDefault.projectDefaultProject = project;
				projectDefault.projectDefaultUser = user;

				user.userProjects = [projectUser];
				user.userDefaultProject = projectDefault;

				return user;
			},
		});
	}

	private async authenticateUserWithAllAndDefaultProjects(user: UserEntity): Promise<FailedAuthReasonUser | FailedAuthReasonProject | SuccessfulAuthWithUserAndProject> {
		const projectUsersWithProjects = await this.projectUserService.findAllProjectsForUser(user.userId);
		if (projectUsersWithProjects.length === 0) return { authEntity: null, authErrorReason: "project" };
		projectUsersWithProjects.forEach((projectUser: ProjectUserEntity) => (projectUser.projectUserUser = user));

		const userDefaultProjectConnection = await this.projectDefaultService.findOrCreateUserDefaultProjectConnection(user.userId, projectUsersWithProjects[0].projectUserProjectId);

		const defaultProjectUserIndex = projectUsersWithProjects.findIndex(
			(projectUser: ProjectUserEntity) => projectUser.projectUserProjectId === userDefaultProjectConnection.projectDefaultProjectId,
		);

		userDefaultProjectConnection.projectDefaultProject = projectUsersWithProjects[defaultProjectUserIndex].projectUserProject;
		userDefaultProjectConnection.projectDefaultUser = user;

		user.userDefaultProject = userDefaultProjectConnection;
		user.userProjects = projectUsersWithProjects;

		return { authEntity: user, authErrorReason: null };
	}
}
