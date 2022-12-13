import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { ConfigType, TokenConfig } from "@sca/config";
import { ExtractJwt, StrategyOptions } from "passport-jwt";

@Injectable()
export class JwtStrategyConfigFactory {
	public constructor(private configService: ConfigService<ConfigType, true>) {}

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
