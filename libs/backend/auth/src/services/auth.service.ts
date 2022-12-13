import { Injectable, UnauthorizedException } from "@nestjs/common";
import { UserDomainService, UserEntity } from "@sca/data-access-layer";
import { SignInResponseDto, UserCredentialsDto } from "@sca/dto";
import { PasswordService, TokenService } from "@sca/security";
import { UnauthorizedExceptionMessage } from "../const";

@Injectable()
export class AuthService {
	public constructor(
		// Dependencies

		private readonly userDomainService: UserDomainService,
		private readonly tokenService: TokenService,
		private readonly passwordService: PasswordService,
	) {}

	public async signIn(credentials: UserCredentialsDto): Promise<SignInResponseDto> {
		const userEntity = await this.authenticate(credentials);

		const accessToken = this.tokenService.createAccessToken(userEntity);
		const refreshToken = this.tokenService.createRefreshToken();

		return { accessToken: await accessToken, refreshToken: await refreshToken };
	}

	private async authenticate(credentials: UserCredentialsDto): Promise<UserEntity> {
		const userEntity = await this.userDomainService.findUserForSignIn(credentials);

		if (!userEntity) throw new UnauthorizedException(UnauthorizedExceptionMessage);

		const passwordIsSame = await this.passwordService.verifyPassword(credentials.userPassword, userEntity.userPassword);

		if (!passwordIsSame) throw new UnauthorizedException(UnauthorizedExceptionMessage);

		return userEntity;
	}
}
