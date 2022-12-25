import { Injectable } from "@nestjs/common";
import type { ProjectEntity, ProjectUserEntity, UserEntity } from "@sca-backend/data-access-layer";
import { TokenService } from "@sca-backend/security";
import type { IAccessTokenPayload, IAuthenticatedProject, IRefreshTokenPayload } from "@sca-shared/dto";

@Injectable()
export class AuthTokenService {
	public constructor(
		// Dependencies

		private readonly tokenService: TokenService,
	) {}

	public async prepareAccessToken(userWithProject: UserEntity): Promise<string> {
		const payload: Omit<IAccessTokenPayload, "tokenIdentity"> = {
			userUuid: userWithProject.userUuid,
			userFirstName: userWithProject.userFirstName,
			userMiddleName: userWithProject.userMiddleName,
			userLastName: userWithProject.userLastName,
			userEmail: userWithProject.userEmail,
			userDefaultProject: this.prepareSingleProjectStructure(userWithProject.userDefaultProject.projectDefaultProject),
			userProjects: this.prepareAllProjectStructure(userWithProject.userProjects),
		};

		return await this.tokenService.createAndSignAccessToken(payload);
	}

	public async prepareRefreshToken(userWithProject: UserEntity): Promise<string> {
		const payload: Omit<IRefreshTokenPayload, "tokenIdentity"> = {
			userUuid: userWithProject.userUuid,
			projectUuid: userWithProject.userDefaultProject.projectDefaultProject.projectUuid,
		};

		return await this.tokenService.createAndSignRefreshToken(payload);
	}

	private prepareAllProjectStructure(projects: Array<ProjectUserEntity>): Array<IAuthenticatedProject> {
		return projects.map((projectUser: ProjectUserEntity) => this.prepareSingleProjectStructure(projectUser.projectUserProject));
	}

	private prepareSingleProjectStructure(project: ProjectEntity): IAuthenticatedProject {
		return {
			projectUuid: project.projectUuid,
			projectName: project.projectName,
			projectDomain: project.projectDomain,
		};
	}
}
