import type { IProjectUserSignInRequestDto, IProjectUserSignInResponseDto } from "@sca-shared/dto";

export class SignInRequestDto implements IProjectUserSignInRequestDto {
	public userEmail: string;
	public userPassword: string;
}

export class SignInResponseDto implements IProjectUserSignInResponseDto {
	public accessToken: string;
	public refreshToken: string;
}
