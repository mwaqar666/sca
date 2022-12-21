import type { ISignUpResponse } from "@sca-shared/dto";

export class SignUpResponseDto implements ISignUpResponse {
	public accessToken: string;
	public refreshToken: string;
}
