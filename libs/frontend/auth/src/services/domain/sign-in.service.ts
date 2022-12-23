import { Injectable } from "@angular/core";
import { ApiRouteService } from "@sca-frontend/api";
import { AuthApiRoutes } from "@sca-shared/dto";
import type { SignInRequestDto, SignInResponseDto } from "../../dto";
import { SignInApiService } from "../api";

@Injectable()
export class SignInService {
	public constructor(
		// Dependencies

		private readonly apiRouteService: ApiRouteService,
		private readonly signInApiService: SignInApiService,
	) {}

	public async signIn(signInRequestDto: SignInRequestDto): Promise<SignInResponseDto> {
		const signInRoute = this.apiRouteService.findRoute(AuthApiRoutes.Routes.SignIn.Name).withRequestModel(signInRequestDto).getProcessedRoute<SignInRequestDto>();
		const { successful, response } = await this.signInApiService.execute(signInRoute);

		if (!successful) throw new Error(response.error);

		return response;
	}
}
