import { type CanActivate, type ExecutionContext, Injectable } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { UserProjectIdentityService } from "@sca-backend/data-access-layer";
import { TokenService } from "@sca-backend/security";
import type { IRefreshTokenPayload } from "@sca-shared/dto";
import { BaseGuard } from "../../base";
import { AuthUser } from "../../const";
import { JwtExtractorService } from "../../services";
import type { IAuthUserRequest } from "../../types";

@Injectable()
export class RefreshTokenHttpGuard extends BaseGuard<IAuthUserRequest, IRefreshTokenPayload> implements CanActivate {
	public constructor(
		// Dependencies

		private readonly reflector: Reflector,
		private readonly tokenService: TokenService,
		private readonly jwtExtractorService: JwtExtractorService,
		private readonly identityService: UserProjectIdentityService,
	) {
		super(reflector);
	}

	public async canActivate(context: ExecutionContext): Promise<boolean> {
		const request = this.shouldActivateHttp(context);

		if (!request) return true;

		const jwtToken = this.jwtExtractorService.extractJwtFromHttpRequestHeader(request);

		return await this.verifyAndAuthenticatedTokenPayload(request, jwtToken, this.tokenService.verifyRefreshToken);
	}

	protected async authenticatePayload(request: IAuthUserRequest, payload: Omit<IRefreshTokenPayload, "tokenIdentity">): Promise<boolean> {
		const { authEntity, authErrorReason } = await this.identityService.authenticateUserUsingUuidWithAllAndDefaultProjects(payload.userUuid);

		if (authErrorReason) return false;

		request[AuthUser] = authEntity;

		return true;
	}
}