import type { IProjectUserSignInResponseDto } from "./project-user-sign-in-response";

export class ProjectUserSignInResponseDto implements IProjectUserSignInResponseDto {
	public accessToken: string;
	public refreshToken: string;
}
