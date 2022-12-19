import { Injectable, UnauthorizedException } from "@nestjs/common";
import { type UserEntity, UserProjectIdentityService } from "@sca-backend/data-access-layer";
import { PasswordService, TokenService } from "@sca-backend/security";
import type { ISignInRequest, ISignInResponse, ISignUpRequest, ISignUpResponse } from "@sca-shared/dto";
import { ProjectUnavailableExceptionMessage, UnauthorizedExceptionMessage } from "../const";

@Injectable()
export class AuthService {
	public constructor(
		// Dependencies

		private readonly identityService: UserProjectIdentityService,
		private readonly tokenService: TokenService,
		private readonly passwordService: PasswordService,
	) {}

	public async signIn(signInRequest: ISignInRequest): Promise<ISignInResponse> {
		const authUserWithDefaultAndAllProjects = await this.authenticateProjectUser(signInRequest);

		return this.createAuthenticationTokens(authUserWithDefaultAndAllProjects);
	}

	public async signUp(signUpRequest: ISignUpRequest): Promise<ISignUpResponse> {
		const authUserWithDefaultAndAllProjects = await this.identityService.registerUserWithProject(signUpRequest);

		return this.createAuthenticationTokens(authUserWithDefaultAndAllProjects);
	}

	private async createAuthenticationTokens(user: UserEntity): Promise<{ accessToken: string; refreshToken: string }> {
		const accessToken = this.tokenService.createAccessToken(user);
		const refreshToken = this.tokenService.createRefreshToken(user);

		return { accessToken: await accessToken, refreshToken: await refreshToken };
	}

	private async authenticateProjectUser(signInRequest: ISignInRequest): Promise<UserEntity> {
		const { authUser, authErrorReason } = await this.identityService.authenticateProjectUserWithAllAndDefaultProjects(signInRequest);

		if (authErrorReason) throw new UnauthorizedException(authErrorReason === "user" ? UnauthorizedExceptionMessage : ProjectUnavailableExceptionMessage);

		const passwordIsSame = await this.passwordService.verifyPassword(signInRequest.userPassword, authUser.userPassword);

		if (!passwordIsSame) throw new UnauthorizedException(UnauthorizedExceptionMessage);

		return authUser;
	}
}
