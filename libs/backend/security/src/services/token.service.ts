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

	public async createAccessToken(userEntity: UserEntity): Promise<string> {
		const accessTokenPayload: AccessTokenPayloadDto = {
			secretIdentity: this.cryptService.encrypt(AccessToken),
			userUuid: userEntity.userUuid,
			userFirstName: userEntity.userFirstName,
			userMiddleName: userEntity.userMiddleName,
			userLastName: userEntity.userLastName,
		};

		return this.jwtService.signAsync(accessTokenPayload);
	}

	public async createRefreshToken(): Promise<string> {
		const refreshTokenPayload: RefreshTokenPayloadDto = {
			secretIdentity: this.cryptService.encrypt(RefreshToken),
		};

		return this.jwtService.signAsync(refreshTokenPayload);
	}
}
