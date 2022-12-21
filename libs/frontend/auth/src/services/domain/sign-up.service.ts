import { Injectable } from "@angular/core";
import { ApiRouteService } from "@sca-frontend/api";
import { AuthApiRoutes } from "@sca-shared/dto";
import type { SignUpRequestDto, SignUpResponseDto } from "../../dto";
import { SignUpApiService } from "../api";

@Injectable()
export class SignUpService {
	public constructor(
		// Dependencies

		private readonly apiRouteService: ApiRouteService,
		private readonly signUpApiService: SignUpApiService,
	) {}

	public async signUp(signUpRequestDto: SignUpRequestDto): Promise<SignUpResponseDto> {
		const signUpRoute = this.apiRouteService.findRoute(AuthApiRoutes.routes.signUp.name).withRequestModel(signUpRequestDto).getProcessedRoute<SignUpRequestDto>();
		const { successful, response } = await this.signUpApiService.execute(signUpRoute);

		if (!successful) throw new Error(response.error);

		return response;
	}
}
