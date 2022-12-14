import { type CanActivate, type ExecutionContext, Injectable } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { UserProjectIdentityService } from "@sca-backend/data-access-layer";
import { TokenService } from "@sca-backend/security";
import type { IPurePayload, IRefreshTokenPayload } from "@sca-shared/dto";
import { BaseGuard } from "../../base";
import { AuthUser } from "../../const";
import { JwtExtractorService } from "../../services";
import type { IAuthUserRefreshRequest } from "../../types";

@Injectable()
export class RefreshTokenHttpGuard extends BaseGuard<IAuthUserRefreshRequest, IRefreshTokenPayload> implements CanActivate {
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

		const jwtToken = this.jwtExtractorService.extractJwtFromHttpRequestBody(request, "refreshToken");

		return await this.verifyAndAuthenticatedTokenPayload(request, jwtToken, this.tokenService, this.tokenService.verifyRefreshToken);
	}

	protected async authenticatePayload(request: IAuthUserRefreshRequest, payload: IPurePayload<IRefreshTokenPayload>): Promise<boolean> {
		const { authEntity, authErrorReason } = await this.identityService.authenticateUserUsingUuidWithAllAndCurrentProjects(payload.userUuid, payload.projectUuid);

		if (authErrorReason) return false;

		request[AuthUser] = authEntity;

		return true;
	}
}
