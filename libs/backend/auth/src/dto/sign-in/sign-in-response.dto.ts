import { ISignInResponse } from "@sca-shared/dto";

export class SignInResponseDto implements ISignInResponse {
	public accessToken: string;
	public refreshToken: string;
}
