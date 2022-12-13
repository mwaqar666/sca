import { Injectable } from "@nestjs/common";
import { RefreshTokenPayloadDto } from "@sca/dto";
import { BaseJwtStrategyFactory } from "../base";
import { REFRESH_TOKEN_STRATEGY } from "../const";
import { JwtStrategyConfigFactory } from "../factories";

@Injectable()
export class RefreshTokenStrategy extends BaseJwtStrategyFactory(REFRESH_TOKEN_STRATEGY) {
	public constructor(private readonly jwtStrategyConfig: JwtStrategyConfigFactory) {
		super(jwtStrategyConfig.refreshTokenStrategyConfig);
	}

	public async validate(refreshTokenPayload: RefreshTokenPayloadDto): Promise<void> {
		console.log(refreshTokenPayload);
	}
}
