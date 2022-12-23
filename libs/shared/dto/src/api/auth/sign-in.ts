export interface ISignInRequest {
	userEmail: string;
	userPassword: string;
}

export interface ISignInResponse {
	accessToken: string;
	refreshToken: string;
}
