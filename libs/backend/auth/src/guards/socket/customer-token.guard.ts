import { type CanActivate, type ExecutionContext, Injectable } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { CustomerProjectIdentityService } from "@sca-backend/data-access-layer";
import { TokenService } from "@sca-backend/security";
import type { ICustomerTokenPayload } from "@sca-shared/dto";
import { BaseGuard } from "../../base";
import { AuthCustomer } from "../../const";
import { JwtExtractorService } from "../../services";
import type { IAuthCustomerSocket } from "../../types";

@Injectable()
export class CustomerTokenGuard extends BaseGuard<IAuthCustomerSocket, ICustomerTokenPayload> implements CanActivate {
	public constructor(
		// Dependencies

		private readonly reflector: Reflector,
		private readonly tokenService: TokenService,
		private readonly jwtExtractorService: JwtExtractorService,
		private readonly identityService: CustomerProjectIdentityService,
	) {
		super(reflector);
	}

	public async canActivate(context: ExecutionContext): Promise<boolean> {
		const socket = this.shouldActivateSocket(context);

		if (!socket) return true;

		const jwtToken = this.jwtExtractorService.extractJwtFromSocketRequestHeader(socket);

		return await this.verifyAndAuthenticatedTokenPayload(socket, jwtToken, this.tokenService.verifyRefreshToken);
	}

	protected async authenticatePayload(socket: IAuthCustomerSocket, payload: Omit<ICustomerTokenPayload, "tokenIdentity">): Promise<boolean> {
		const { authEntity, authErrorReason } = await this.identityService.authenticateCustomerWithUuidWithAllProjects(payload.customerUuid, payload.projectUuid);

		if (authErrorReason) return false;

		socket.data[AuthCustomer] = authEntity;

		return true;
	}
}
