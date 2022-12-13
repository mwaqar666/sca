import { Injectable } from "@nestjs/common";
import { AccessTokenPayloadDto } from "@sca/dto";
import { BaseJwtStrategyFactory } from "../base";
import { ACCESS_TOKEN_STRATEGY } from "../const";
import { JwtStrategyConfigFactory } from "../factories";

@Injectable()
export class AccessTokenStrategy extends BaseJwtStrategyFactory(ACCESS_TOKEN_STRATEGY) {
	public constructor(private readonly jwtStrategyConfig: JwtStrategyConfigFactory) {
		super(jwtStrategyConfig.accessTokenStrategyConfig);
	}

	public async validate(accessTokenPayload: AccessTokenPayloadDto): Promise<void> {
		console.log(accessTokenPayload);
	}
}
