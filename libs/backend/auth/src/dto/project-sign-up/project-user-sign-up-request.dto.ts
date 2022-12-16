import type { IProjectUserSignUpRequestDto } from "@sca-shared/dto";
import type { Nullable } from "@sca-shared/utils";
import { IsEmail, IsNotEmpty, IsOptional, IsString, MaxLength, MinLength } from "class-validator";

export class ProjectUserSignUpRequestDto implements IProjectUserSignUpRequestDto {
	@MaxLength(100)
	@MinLength(3)
	@IsString()
	@IsNotEmpty()
	public userFirstName: string;

	@MaxLength(100)
	@MinLength(3)
	@IsString()
	@IsOptional()
	public userMiddleName: Nullable<string>;

	@MaxLength(100)
	@MinLength(3)
	@IsString()
	@IsNotEmpty()
	public userLastName: string;

	@MaxLength(100)
	@MinLength(3)
	@IsEmail()
	@IsString()
	@IsNotEmpty()
	public userEmail: string;

	@MaxLength(100)
	@MinLength(3)
	@IsString()
	@IsNotEmpty()
	public userPassword: string;

	@MaxLength(100)
	@MinLength(3)
	@IsString()
	@IsNotEmpty()
	public userPasswordConfirm: string;
}
