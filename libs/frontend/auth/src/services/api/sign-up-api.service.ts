import { Injectable } from "@angular/core";
import { ApiService, type IProcessedApiRoute, type ResponseReturn } from "@sca-frontend/api";
import { ConfigService } from "@sca-frontend/config";
import type { SignUpRequestDto, SignUpResponseDto } from "../../dto";

@Injectable()
export class SignUpApiService extends ApiService<SignUpApiService, SignUpRequestDto, SignUpResponseDto> {
	public constructor(
		// Dependencies

		private readonly configService: ConfigService,
	) {
		super(configService);
	}

	public async execute(this: SignUpApiService, routeModel: IProcessedApiRoute<SignUpRequestDto>): Promise<ResponseReturn<SignUpResponseDto, unknown>> {
		return await this.sendRequest(routeModel);
	}
}
