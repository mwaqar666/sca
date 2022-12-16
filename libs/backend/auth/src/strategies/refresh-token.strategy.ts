import { Injectable } from "@nestjs/common";
import { type RefreshTokenPayloadDto } from "@sca-shared/dto";
import { BaseJwtStrategyFactory } from "../base";
import { REFRESH_TOKEN_STRATEGY } from "../const";
import { JwtStrategyConfigFactory } from "../factories";

@Injectable()
export class RefreshTokenStrategy extends BaseJwtStrategyFactory(REFRESH_TOKEN_STRATEGY) {
	public constructor(
		// Dependencies

		private readonly jwtStrategyConfig: JwtStrategyConfigFactory,
	) {
		super(jwtStrategyConfig.refreshTokenStrategyConfig);
	}

	public async validate(refreshTokenPayload: RefreshTokenPayloadDto): Promise<void> {
		console.log(refreshTokenPayload);
	}
}
