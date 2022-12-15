import { Injectable, UnauthorizedException } from "@nestjs/common";
import { type UserEntity, UserProjectIdentityService } from "@sca/data-access-layer";
import type { ProjectUserSignInRequestDto, ProjectUserSignInResponseDto } from "@sca/dto";
import { PasswordService, TokenService } from "@sca/security";
import { ProjectUnavailableExceptionMessage, UnauthorizedExceptionMessage } from "../const";

@Injectable()
export class AuthService {
	public constructor(
		// Dependencies

		private readonly identityService: UserProjectIdentityService,
		private readonly tokenService: TokenService,
		private readonly passwordService: PasswordService,
	) {}

	public async projectUserSignIn(projectUserSignInRequestDto: ProjectUserSignInRequestDto): Promise<ProjectUserSignInResponseDto> {
		const authUserWithDefaultAndAllProjects = await this.authenticateProjectUser(projectUserSignInRequestDto);

		const accessToken = this.tokenService.createAccessToken(authUserWithDefaultAndAllProjects);
		const refreshToken = this.tokenService.createRefreshToken(authUserWithDefaultAndAllProjects);

		return { accessToken: await accessToken, refreshToken: await refreshToken };
	}

	private async authenticateProjectUser(projectUserSignInRequestDto: ProjectUserSignInRequestDto): Promise<UserEntity> {
		const { authUser, authErrorReason } = await this.identityService.authenticateProjectUserWithAllAndDefaultProjects(projectUserSignInRequestDto);

		if (authErrorReason) throw new UnauthorizedException(authErrorReason === "user" ? UnauthorizedExceptionMessage : ProjectUnavailableExceptionMessage);

		const passwordIsSame = await this.passwordService.verifyPassword(projectUserSignInRequestDto.userPassword, authUser.userPassword);

		if (!passwordIsSame) throw new UnauthorizedException(UnauthorizedExceptionMessage);

		return authUser;
	}
}
