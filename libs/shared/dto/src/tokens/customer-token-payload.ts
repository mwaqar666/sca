import type { ITokenIdentity } from "./token-identity";

export interface ICustomerTokenPayload extends ITokenIdentity {
	projectUuid: string;
	customerUuid: string;
}
