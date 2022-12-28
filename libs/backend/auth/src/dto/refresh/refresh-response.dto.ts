import type { ISignInResponse } from "@sca-shared/dto";

export class RefreshResponseDto implements ISignInResponse {
	public accessToken: string;
	public refreshToken: string;
}
