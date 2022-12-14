import { Injectable, UnauthorizedException } from "@nestjs/common";
import { UserEntity, UserProjectIdentityService } from "@sca/data-access-layer";
import { SignInRequestDto, SignInResponseDto } from "@sca/dto";
import { PasswordService, TokenService } from "@sca/security";
import { UnauthorizedExceptionMessage } from "../const";

@Injectable()
export class AuthService {
	public constructor(
		// Dependencies

		private readonly identityService: UserProjectIdentityService,
		private readonly tokenService: TokenService,
		private readonly passwordService: PasswordService,
	) {}

	public async signIn(signInRequestDto: SignInRequestDto): Promise<SignInResponseDto> {
		const userWithProject = await this.authenticate(signInRequestDto);

		const accessToken = this.tokenService.createAccessToken(userWithProject);
		const refreshToken = this.tokenService.createRefreshToken(userWithProject);

		return { accessToken: await accessToken, refreshToken: await refreshToken };
	}

	private async authenticate(signInRequestDto: SignInRequestDto): Promise<UserEntity> {
		const userEntity = await this.identityService.authenticateUserWithProject(signInRequestDto);

		if (!userEntity) throw new UnauthorizedException(UnauthorizedExceptionMessage);

		const passwordIsSame = await this.passwordService.verifyPassword(signInRequestDto.userPassword, userEntity.userPassword);

		if (!passwordIsSame) throw new UnauthorizedException(UnauthorizedExceptionMessage);

		return userEntity;
	}
}
