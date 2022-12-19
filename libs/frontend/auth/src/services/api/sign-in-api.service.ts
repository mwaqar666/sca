import { Injectable } from "@angular/core";
import { ApiService, type IProcessedApiRoute, type ResponseReturn } from "@sca-frontend/api";
import { ConfigService } from "@sca-frontend/config";
import type { SignInRequestDto, SignInResponseDto } from "../../dto";

@Injectable()
export class SignInApiService extends ApiService<SignInApiService, SignInRequestDto, SignInResponseDto> {
	public constructor(
		// Dependencies

		private readonly configService: ConfigService,
	) {
		super(configService);
	}

	public async execute(this: SignInApiService, routeModel: IProcessedApiRoute<SignInRequestDto>): Promise<ResponseReturn<SignInResponseDto, unknown>> {
		return this.sendRequest(routeModel);
	}
}
