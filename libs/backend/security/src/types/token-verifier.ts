import type { Nullable } from "@sca-shared/utils";

export type TokenVerifier<T> = (jwtToken: string) => Promise<Nullable<Omit<T, "tokenIdentity">>>;
