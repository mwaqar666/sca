import type { ITokenIdentity } from "./token-identity";

export interface IRefreshTokenPayload extends ITokenIdentity {
	userUuid: string;
	projectUuid: string;
}
