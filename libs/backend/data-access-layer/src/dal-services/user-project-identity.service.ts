import { Inject, Injectable } from "@nestjs/common";
import { AggregateService } from "@sca-backend/aggregate";
import { RunningTransaction, SequelizeScopeConst } from "@sca-backend/db";
import type { ISignInRequest, ISignUpRequest } from "@sca-shared/dto";
import { DomainExtensionsAggregateConst } from "../const";
import { ProjectDefaultService, ProjectService, type ProjectUserEntity, ProjectUserService, type UserEntity, UserService } from "../domains";
import type { FailedAuthReasonProject, FailedAuthReasonUser, SuccessfulAuthWithUserAndProject } from "../dto";
import { IDomainExtensionsAggregate } from "../types";

@Injectable()
export class UserProjectIdentityService {
	public constructor(
		// Dependencies

		private readonly userService: UserService,
		private readonly projectService: ProjectService,
		private readonly projectUserService: ProjectUserService,
		private readonly projectDefaultService: ProjectDefaultService,
		@Inject(DomainExtensionsAggregateConst) private readonly aggregateService: AggregateService<IDomainExtensionsAggregate>,
	) {}

	public async authenticateProjectUserWithAllAndDefaultProjects(signInRequest: ISignInRequest): Promise<FailedAuthReasonUser | FailedAuthReasonProject | SuccessfulAuthWithUserAndProject> {
		const user = await this.userService.findUser(signInRequest.userEmail, SequelizeScopeConst.withoutTimestamps);
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

	public async registerUserWithProject(signUpRequest: ISignUpRequest): Promise<UserEntity> {
		return await this.aggregateService.services.sequelize.executeTransactionalOperation({
			transactionCallback: async (runningTransaction: RunningTransaction) => {
				const user = await this.userService.createProjectUser(signUpRequest, runningTransaction);
				const project = await this.projectService.createProject(signUpRequest, runningTransaction);
				const projectUser = await this.projectUserService.linkProjectToUser({ user, project }, runningTransaction);
				const projectDefault = await this.projectDefaultService.createUserDefaultProject(user, project, runningTransaction);

				projectUser.projectUserProject = project;
				projectDefault.projectDefaultProject = project;
				user.userProjects = [];
				user.userDefaultProject = projectDefault;

				return user;
			},
		});
	}
}
