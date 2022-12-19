import type { ISignInRequest } from "@sca-shared/dto";
import { IsEmail, IsNotEmpty, IsString } from "class-validator";

export class SignInRequestDto implements ISignInRequest {
	@IsEmail()
	@IsString()
	@IsNotEmpty()
	public userEmail: string;

	@IsString()
	@IsNotEmpty()
	public userPassword: string;
}
