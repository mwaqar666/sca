import { Injectable, UnauthorizedException } from "@nestjs/common";
import { type UserEntity, UserProjectIdentityService } from "@sca/data-access-layer";
import { type SignInRequestDto, type SignInResponseDto } from "@sca/dto";
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
		const userWithProjects = await this.authenticate(signInRequestDto);

		const accessToken = this.tokenService.createAccessToken(userWithProjects);
		const refreshToken = this.tokenService.createRefreshToken(userWithProjects);

		return { accessToken: await accessToken, refreshToken: await refreshToken };
	}

	private async authenticate(signInRequestDto: SignInRequestDto): Promise<UserEntity> {
		const userWithProjects = await this.identityService.authenticateUserWithAllAndDefaultProjects(signInRequestDto);

		if (!userWithProjects) throw new UnauthorizedException(UnauthorizedExceptionMessage);

		const passwordIsSame = await this.passwordService.verifyPassword(signInRequestDto.userPassword, userWithProjects.userPassword);

		if (!passwordIsSame) throw new UnauthorizedException(UnauthorizedExceptionMessage);

		return userWithProjects;
	}
}
