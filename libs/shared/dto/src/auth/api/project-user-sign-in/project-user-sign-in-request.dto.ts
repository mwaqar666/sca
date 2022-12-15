import { IsEmail, IsNotEmpty, IsString } from "class-validator";
import type { IProjectUserSignInRequestDto } from "./project-user-sign-in-request";

export class ProjectUserSignInRequestDto implements IProjectUserSignInRequestDto {
	@IsEmail()
	@IsString()
	@IsNotEmpty()
	public userEmail: string;

	@IsString()
	@IsNotEmpty()
	public userPassword: string;
}
