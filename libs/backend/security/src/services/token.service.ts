import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { JwtService, type JwtSignOptions } from "@nestjs/jwt";
import type { ConfigType, TokenConfig } from "@sca-backend/config";
import { AccessToken, CustomerToken, RefreshToken } from "../const";
import { CryptService } from "./crypt.service";

@Injectable()
export class TokenService {
	private readonly tokenConfig: TokenConfig;

	public constructor(
		// Dependencies

		private readonly jwtService: JwtService,
		private readonly cryptService: CryptService,
		private readonly configService: ConfigService<ConfigType, true>,
	) {
		this.tokenConfig = configService.get<TokenConfig>("tokens");
	}

	public async createAndSignAccessToken<T extends object>(payload: T): Promise<string> {
		payload = { ...payload, tokenIdentity: this.cryptService.encrypt(AccessToken) };
		return this.jwtService.signAsync(payload, this.prepareAccessTokenConfig());
	}

	public async createAndSignRefreshToken<T extends object>(payload: T): Promise<string> {
		payload = { ...payload, tokenIdentity: this.cryptService.encrypt(RefreshToken) };
		return this.jwtService.signAsync(payload, this.prepareRefreshTokenConfig());
	}

	public async createAndSignCustomerToken<T extends object>(payload: T): Promise<string> {
		payload = { ...payload, tokenIdentity: this.cryptService.encrypt(CustomerToken) };
		return this.jwtService.signAsync(payload, this.prepareCustomerTokenConfig());
	}

	private prepareAccessTokenConfig(): JwtSignOptions {
		return {
			secret: this.tokenConfig.accessTokenSecret,
			expiresIn: this.tokenConfig.accessTokenExpiry,
		};
	}

	private prepareRefreshTokenConfig(): JwtSignOptions {
		return {
			secret: this.tokenConfig.refreshTokenSecret,
			expiresIn: this.tokenConfig.refreshTokenExpiry,
		};
	}

	private prepareCustomerTokenConfig(): JwtSignOptions {
		return {
			secret: this.tokenConfig.customerTokenSecret,
			expiresIn: this.tokenConfig.customerTokenExpiry,
		};
	}
}
