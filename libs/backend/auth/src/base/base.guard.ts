import type { CanActivate, ExecutionContext } from "@nestjs/common";
import type { Reflector } from "@nestjs/core";
import type { TokenVerifier } from "@sca-backend/security";
import type { IPurePayload, ITokenIdentity } from "@sca-shared/dto";
import type { Constructable, Nullable, Optional } from "@sca-shared/utils";
import { GuardIdentifier } from "../const";

export abstract class BaseGuard<R, T extends ITokenIdentity> {
	protected constructor(
		// Dependencies

		private readonly nestReflector: Reflector,
	) {}

	protected shouldActivateHttp(context: ExecutionContext): Nullable<R> {
		if (!this.shouldRunGuard(context)) return null;

		return context.switchToHttp().getRequest<R>();
	}

	protected shouldActivateSocket(context: ExecutionContext): Nullable<R> {
		if (!this.shouldRunGuard(context)) return null;

		return context.switchToWs().getClient<R>();
	}

	protected abstract authenticatePayload(requestOrSocket: R, payload: IPurePayload<T>): Promise<boolean>;

	protected async verifyAndAuthenticatedTokenPayload(request: R, jwtToken: Nullable<string>, tokenVerifier: TokenVerifier<T>): Promise<boolean> {
		if (!jwtToken) return false;

		const payload = await tokenVerifier(jwtToken);

		if (!payload) return false;

		return this.authenticatePayload(request, payload);
	}

	private shouldRunGuard(context: ExecutionContext): boolean {
		const guard: Optional<Constructable<CanActivate>> = this.nestReflector.get(GuardIdentifier, context.getHandler());

		if (!guard) return true;

		return guard.name !== this.constructor.name;
	}
}
