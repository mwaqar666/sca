import type { IProjectUserSignInRequestDto } from "@sca-shared/dto";
import { IsEmail, IsNotEmpty, IsString } from "class-validator";

export class ProjectUserSignInRequestDto implements IProjectUserSignInRequestDto {
	@IsEmail()
	@IsString()
	@IsNotEmpty()
	public userEmail: string;

	@IsString()
	@IsNotEmpty()
	public userPassword: string;
}
