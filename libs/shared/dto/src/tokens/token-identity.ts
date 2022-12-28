export interface ITokenIdentity {
	tokenIdentity: string;
}

export type IPurePayload<T extends ITokenIdentity> = Omit<T, "tokenIdentity">;
