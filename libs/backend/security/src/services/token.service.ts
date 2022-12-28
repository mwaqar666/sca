import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { JwtService, type JwtSignOptions } from "@nestjs/jwt";
import type { JwtVerifyOptions } from "@nestjs/jwt/dist/interfaces";
import type { ConfigType, TokenConfig } from "@sca-backend/config";
import type { IPurePayload, ITokenIdentity } from "@sca-shared/dto";
import type { Nullable } from "@sca-shared/utils";
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

	public async createAccessToken<T extends object>(payload: T): Promise<string> {
		return await this.createToken(payload, AccessToken, this.prepareAccessTokenConfig());
	}

	public async verifyAccessToken<T extends ITokenIdentity>(jwtToken: string): Promise<Nullable<IPurePayload<T>>> {
		return await this.verifyToken(jwtToken, AccessToken, this.prepareAccessTokenConfig());
	}

	public async createRefreshToken<T extends object>(payload: T): Promise<string> {
		return await this.createToken(payload, RefreshToken, this.prepareRefreshTokenConfig());
	}

	public async verifyRefreshToken<T extends ITokenIdentity>(jwtToken: string): Promise<Nullable<IPurePayload<T>>> {
		return await this.verifyToken(jwtToken, RefreshToken, this.prepareRefreshTokenConfig());
	}

	public async createCustomerToken<T extends object>(payload: T): Promise<string> {
		return await this.createToken(payload, CustomerToken, this.prepareCustomerTokenConfig());
	}

	public async verifyCustomerToken<T extends ITokenIdentity>(jwtToken: string): Promise<Nullable<IPurePayload<T>>> {
		return await this.verifyToken(jwtToken, CustomerToken, this.prepareCustomerTokenConfig());
	}

	private async verifyToken<T extends ITokenIdentity>(jwtToken: string, tokenVerificationIdentity: string, verificationOptions: JwtVerifyOptions): Promise<Nullable<IPurePayload<T>>> {
		try {
			const verifiedPayload = await this.jwtService.verifyAsync<T>(jwtToken, verificationOptions);
			const { tokenIdentity, ...extractedPayload } = verifiedPayload;

			const hasVerifiedIdentity = this.cryptService.decrypt(tokenIdentity) === tokenVerificationIdentity;
			if (!hasVerifiedIdentity) return null;

			return extractedPayload;
		} catch {
			return null;
		}
	}

	private async createToken<T extends object>(payload: T, tokenVerificationIdentity: string, signingOptions: JwtSignOptions): Promise<string> {
		payload = { ...payload, tokenIdentity: this.cryptService.encrypt(tokenVerificationIdentity) };
		return this.jwtService.signAsync(payload, signingOptions);
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
