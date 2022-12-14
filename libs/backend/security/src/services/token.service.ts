import { Injectable } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { type ProjectEntity, type UserEntity } from "@sca/data-access-layer";
import { type AccessTokenPayloadDto, type AuthenticatedProject, type RefreshTokenPayloadDto } from "@sca/dto";
import { AccessToken, RefreshToken } from "../const";
import { CryptService } from "./crypt.service";

@Injectable()
export class TokenService {
	public constructor(
		// Dependencies

		private readonly jwtService: JwtService,
		private readonly cryptService: CryptService,
	) {}

	public async createAccessToken(userWithProject: UserEntity): Promise<string> {
		const accessTokenPayload: AccessTokenPayloadDto = {
			tokenIdentity: this.cryptService.encrypt(AccessToken),
			userUuid: userWithProject.userUuid,
			userFirstName: userWithProject.userFirstName,
			userMiddleName: userWithProject.userMiddleName,
			userLastName: userWithProject.userLastName,
			userEmail: userWithProject.userEmail,
			userDefaultProject: this.prepareSingleProjectStructure(userWithProject.userDefaultProject),
			userProjects: this.prepareAllProjectStructure(userWithProject.userProjects),
		};

		return this.jwtService.signAsync(accessTokenPayload);
	}

	public async createRefreshToken(userWithProject: UserEntity): Promise<string> {
		const refreshTokenPayload: RefreshTokenPayloadDto = {
			tokenIdentity: this.cryptService.encrypt(RefreshToken),
			userUuid: userWithProject.userUuid,
			projectUuid: userWithProject.userDefaultProject.projectUuid,
		};

		return this.jwtService.signAsync(refreshTokenPayload);
	}

	private prepareAllProjectStructure(projects: Array<ProjectEntity>): Array<AuthenticatedProject> {
		return projects.map((project: ProjectEntity) => this.prepareSingleProjectStructure(project));
	}

	private prepareSingleProjectStructure(project: ProjectEntity): AuthenticatedProject {
		return {
			projectUuid: project.projectUuid,
			projectName: project.projectName,
			projectDomain: project.projectDomain,
		};
	}
}
