import { ISignUpResponse } from "@sca-shared/dto";

export class SignUpResponseDto implements ISignUpResponse {
	accessToken: string;
	refreshToken: string;
}
