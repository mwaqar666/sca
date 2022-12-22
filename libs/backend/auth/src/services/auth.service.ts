import { Injectable, UnauthorizedException } from "@nestjs/common";
import { type UserEntity, UserProjectIdentityService } from "@sca-backend/data-access-layer";
import { PasswordService } from "@sca-backend/security";
import type { ISignInRequest, ISignInResponse, ISignUpRequest, ISignUpResponse } from "@sca-shared/dto";
import { ProjectUnavailableExceptionMessage, UnauthorizedExceptionMessage } from "../const";
import { AuthTokenService } from "./auth-token.service";

@Injectable()
export class AuthService {
	public constructor(
		// Dependencies

		private readonly identityService: UserProjectIdentityService,
		private readonly passwordService: PasswordService,
		private readonly authTokenService: AuthTokenService,
	) {}

	public async signIn(signInRequest: ISignInRequest): Promise<ISignInResponse> {
		const authUserWithDefaultAndAllProjects = await this.authenticateProjectUser(signInRequest);

		return this.createAuthenticationTokens(authUserWithDefaultAndAllProjects);
	}

	public async signUp(signUpRequest: ISignUpRequest): Promise<ISignUpResponse> {
		const authUserWithDefaultAndAllProjects = await this.identityService.registerUserWithProject(signUpRequest);

		return this.createAuthenticationTokens(authUserWithDefaultAndAllProjects);
	}

	private async createAuthenticationTokens(user: UserEntity): Promise<ISignInResponse & ISignUpResponse> {
		const accessToken = this.authTokenService.prepareAccessToken(user);
		const refreshToken = this.authTokenService.prepareRefreshToken(user);

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
