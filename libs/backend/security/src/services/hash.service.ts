import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import type { ConfigType, CryptConfig } from "@sca/config";
import { compare, hash } from "bcrypt";

@Injectable()
export class HashService {
	private cryptConfig: CryptConfig;

	public constructor(
		// Dependencies

		private readonly configService: ConfigService<ConfigType, true>,
	) {
		this.prepareCryptConfig();
	}

	public async hashString(stringToHash: string): Promise<string> {
		return await hash(stringToHash, this.cryptConfig.saltIterations);
	}

	public async hashEquals(stringToCompare: string, hashToCompare: string): Promise<boolean> {
		return await compare(stringToCompare, hashToCompare);
	}

	private prepareCryptConfig(): void {
		this.cryptConfig = this.configService.get<CryptConfig>("crypt");
	}
}
