import type { ISignUpRequest, ISignUpResponse } from "@sca-shared/dto";
import type { Nullable } from "@sca-shared/utils";

export class SignUpRequestDto implements ISignUpRequest {
	public userFirstName: string;
	public userMiddleName: Nullable<string>;
	public userLastName: string;
	public userEmail: string;
	public userPassword: string;
	public userPasswordConfirm: string;
	public projectName: string;
	public projectDomain: string;
}

export class SignUpResponseDto implements ISignUpResponse {
	public accessToken: string;
	public refreshToken: string;
}
