import { IProjectUserSignInResponseDto } from "@sca-shared/dto";

export class ProjectUserSignInResponseDto implements IProjectUserSignInResponseDto {
	public accessToken: string;
	public refreshToken: string;
}
