import type { ISignInRequest, ISignInResponse } from "@sca-shared/dto";

export class SignInRequestDto implements ISignInRequest {
	public userEmail: string;
	public userPassword: string;
}

export class SignInResponseDto implements ISignInResponse {
	public accessToken: string;
	public refreshToken: string;
}
