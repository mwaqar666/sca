import { Injectable } from "@nestjs/common";
import type { ProjectUserEntity, UserEntity } from "@sca-backend/data-access-layer";
import { TokenService } from "@sca-backend/security";
import type { IAccessTokenPayload, IAuthenticatedProject, IPurePayload, IRefreshTokenPayload } from "@sca-shared/dto";

@Injectable()
export class AuthTokenService {
	public constructor(
		// Dependencies

		private readonly tokenService: TokenService,
	) {}

	public async prepareAccessToken(userWithProject: UserEntity): Promise<string> {
		const payload: IPurePayload<IAccessTokenPayload> = {
			userUuid: userWithProject.userUuid,
			userFirstName: userWithProject.userFirstName,
			userMiddleName: userWithProject.userMiddleName,
			userLastName: userWithProject.userLastName,
			userEmail: userWithProject.userEmail,
			userCurrentProject: this.prepareSingleProjectStructure(userWithProject.userCurrentProject),
			userProjects: this.prepareAllProjectStructure(userWithProject.userProjects),
		};

		return await this.tokenService.createAccessToken(payload);
	}

	public async prepareRefreshToken(userWithProject: UserEntity): Promise<string> {
		const payload: IPurePayload<IRefreshTokenPayload> = {
			userUuid: userWithProject.userUuid,
			projectUuid: userWithProject.userCurrentProject.projectUserProject.projectUuid,
		};

		return await this.tokenService.createRefreshToken(payload);
	}

	private prepareAllProjectStructure(projects: Array<ProjectUserEntity>): Array<IAuthenticatedProject> {
		return projects.map((projectUser: ProjectUserEntity) => this.prepareSingleProjectStructure(projectUser));
	}

	private prepareSingleProjectStructure(projectUser: ProjectUserEntity): IAuthenticatedProject {
		return {
			projectUuid: projectUser.projectUserProject.projectUuid,
			projectName: projectUser.projectUserProject.projectName,
			projectDomain: projectUser.projectUserProject.projectDomain,
			projectIsDefault: projectUser.projectUserIsDefault,
		};
	}
}
