import { type CanActivate, type ExecutionContext, Injectable } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { UserProjectIdentityService } from "@sca-backend/data-access-layer";
import { TokenService } from "@sca-backend/security";
import type { IAccessTokenPayload } from "@sca-shared/dto";
import { BaseGuard } from "../../base";
import { AuthUser } from "../../const";
import { JwtExtractorService } from "../../services";
import type { IAuthUserSocket } from "../../types";

@Injectable()
export class AccessTokenSocketGuard extends BaseGuard<IAuthUserSocket, IAccessTokenPayload> implements CanActivate {
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
		const socket = this.shouldActivateSocket(context);

		if (!socket) return true;

		const jwtToken = this.jwtExtractorService.extractJwtFromSocketRequestHeader(socket);

		return await this.verifyAndAuthenticatedTokenPayload(socket, jwtToken, this.tokenService.verifyAccessToken);
	}

	protected async authenticatePayload(socket: IAuthUserSocket, payload: Omit<IAccessTokenPayload, "tokenIdentity">): Promise<boolean> {
		const { authEntity, authErrorReason } = await this.identityService.authenticateUserUsingUuidWithAllAndDefaultProjects(payload.userUuid);

		if (authErrorReason) return false;

		socket.data[AuthUser] = authEntity;

		return true;
	}
}
