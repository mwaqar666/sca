import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import type { ConfigType, TokenConfig } from "@sca-backend/config";
import { ExtractJwt, type StrategyOptions } from "passport-jwt";

@Injectable()
export class JwtStrategyConfigFactory {
	public constructor(
		// Dependencies

		private configService: ConfigService<ConfigType, true>,
	) {}

	public get accessTokenStrategyConfig(): StrategyOptions {
		const tokenConfig = this.tokenConfiguration();

		return {
			secretOrKey: tokenConfig.accessTokenSecret,
			jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
		};
	}

	public get refreshTokenStrategyConfig(): StrategyOptions {
		const tokenConfig = this.tokenConfiguration();

		return {
			secretOrKey: tokenConfig.refreshTokenSecret,
			jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
		};
	}

	private tokenConfiguration(): TokenConfig {
		return this.configService.get<TokenConfig>("tokens");
	}
}
