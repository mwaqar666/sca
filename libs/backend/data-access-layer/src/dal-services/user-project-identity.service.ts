import { Inject, Injectable } from "@nestjs/common";
import { AggregateService } from "@sca-backend/aggregate";
import { type RunningTransaction, SequelizeScopeConst } from "@sca-backend/db";
import type { ISignInRequest, ISignUpRequest } from "@sca-shared/dto";
import { DomainExtensionsAggregateConst } from "../const";
import { ProjectDefaultService, ProjectService, type ProjectUserEntity, ProjectUserService, type UserEntity, UserService } from "../domains";
import type { FailedAuthReasonProject, FailedAuthReasonUser, SuccessfulAuthWithUserAndProject } from "../dto";
import type { IDomainExtensionsAggregate } from "../types";

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

		const projectUsersWithProjects = await this.projectUserService.findAllProjectsForUser(user.userId, SequelizeScopeConst.withoutTimestamps);
		if (projectUsersWithProjects.length === 0) return { authUser: null, authErrorReason: "project" };

		const userDefaultProjectConnection = await this.projectDefaultService.findOrCreateUserDefaultProjectConnection(user.userId, projectUsersWithProjects[0].projectUserProjectId);

		const defaultProjectUserIndex = projectUsersWithProjects.findIndex(
			(projectUser: ProjectUserEntity) => projectUser.projectUserProjectId === userDefaultProjectConnection.projectDefaultProjectId,
		);
		userDefaultProjectConnection.projectDefaultProject = projectUsersWithProjects[defaultProjectUserIndex].projectUserProject;

		user.userDefaultProject = userDefaultProjectConnection;
		user.userProjects = projectUsersWithProjects;

		return { authUser: user, authErrorReason: null };
	}

	public async registerUserWithProject(signUpRequest: ISignUpRequest): Promise<UserEntity> {
		return await this.aggregateService.services.sequelize.executeTransactionalOperation({
			transactionCallback: async (runningTransaction: RunningTransaction) => {
				const user = await this.userService.createUser(signUpRequest, runningTransaction);
				const project = await this.projectService.createProject(signUpRequest, runningTransaction);
				const projectUser = await this.projectUserService.linkProjectToUser({ userId: user.userId, projectId: project.projectId }, runningTransaction);
				const projectDefault = await this.projectDefaultService.createUserDefaultProject(user.userId, project.projectId, runningTransaction);

				projectUser.projectUserProject = project;
				projectDefault.projectDefaultProject = project;
				user.userProjects = [projectUser];
				user.userDefaultProject = projectDefault;

				return user;
			},
		});
	}
}
