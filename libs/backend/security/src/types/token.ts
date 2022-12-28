import type { Nullable } from "@sca-shared/utils";
import type { IPurePayload, ITokenIdentity } from "@sca-shared/dto";

export type TokenVerifier<T extends ITokenIdentity> = (jwtToken: string) => Promise<Nullable<IPurePayload<T>>>;
