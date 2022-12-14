import { Injectable } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { UserEntity } from "@sca/data-access-layer";
import { AccessTokenPayloadDto, RefreshTokenPayloadDto } from "@sca/dto";
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
			projectUuid: userWithProject.userAuthenticatedProject.projectUuid,
			projectName: userWithProject.userAuthenticatedProject.projectName,
			projectDomain: userWithProject.userAuthenticatedProject.projectDomain,
		};

		return this.jwtService.signAsync(accessTokenPayload);
	}

	public async createRefreshToken(userWithProject: UserEntity): Promise<string> {
		const refreshTokenPayload: RefreshTokenPayloadDto = {
			tokenIdentity: this.cryptService.encrypt(RefreshToken),
			userUuid: userWithProject.userUuid,
			projectUuid: userWithProject.userAuthenticatedProject.projectUuid,
		};

		return this.jwtService.signAsync(refreshTokenPayload);
	}
}
