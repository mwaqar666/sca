import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { ConfigType, CryptConfig } from "@sca/config";
import { createCipheriv, createDecipheriv, pbkdf2Sync, randomBytes } from "crypto";

@Injectable()
export class CryptService {
	private cryptConfig: CryptConfig;
	private authTagIndex: number;
	private encryptedTextIndex: number;

	public constructor(
		// Dependencies

		private readonly configService: ConfigService<ConfigType, true>,
	) {
		this.prepareCryptConfig();
	}

	public encrypt(plainText: string): string {
		const bufferedPlainText = Buffer.from(plainText, "utf8");

		const salt = this.generateSalt();
		const cipherByteKey = this.generateByteCipherKey(salt);
		const initializationVector = this.generateInitializationVector();

		const cipher = createCipheriv(this.cryptConfig.blockCipher, cipherByteKey, initializationVector);
		const encryptedText = Buffer.concat([cipher.update(bufferedPlainText), cipher.final()]);
		const authTag = cipher.getAuthTag();

		return Buffer.concat([salt, initializationVector, authTag, encryptedText]).toString("base64");
	}

	public decrypt(encryptedText: string): string {
		const bufferedEncryptedText = Buffer.from(encryptedText, "base64");

		const salt = this.extractSalt(bufferedEncryptedText);
		const initializationVector = this.extractInitializationVector(bufferedEncryptedText);
		const authTag = this.extractAuthTag(bufferedEncryptedText);
		const encryptedMessage = this.extractEncryptedMessage(bufferedEncryptedText);
		const cipherByteKey = this.generateByteCipherKey(salt);

		const decipher = createDecipheriv(this.cryptConfig.blockCipher, cipherByteKey, initializationVector);
		decipher.setAuthTag(authTag);

		return Buffer.concat([decipher.update(encryptedMessage), decipher.final()]).toString("utf8");
	}

	private prepareCryptConfig(): void {
		this.cryptConfig = this.configService.get<CryptConfig>("crypt");
		this.authTagIndex = this.cryptConfig.saltByteLength + this.cryptConfig.initializationVectorByteLength;
		this.encryptedTextIndex = this.authTagIndex + this.cryptConfig.authTagByteLength;
	}

	private generateInitializationVector(): Buffer {
		return randomBytes(this.cryptConfig.initializationVectorByteLength);
	}

	private generateByteCipherKey(salt: Buffer): Buffer {
		return pbkdf2Sync(this.cryptConfig.appKey, salt, this.cryptConfig.saltIterations, this.cryptConfig.encryptionKeyByteLength, this.cryptConfig.saltScheme);
	}

	private generateSalt(): Buffer {
		return randomBytes(this.cryptConfig.saltByteLength);
	}

	private extractSalt(bufferedEncryptedText: Buffer): Buffer {
		return bufferedEncryptedText.subarray(0, this.cryptConfig.saltByteLength);
	}

	private extractInitializationVector(bufferedEncryptedText: Buffer): Buffer {
		return bufferedEncryptedText.subarray(this.cryptConfig.saltByteLength, this.authTagIndex);
	}

	private extractAuthTag(bufferedEncryptedText: Buffer): Buffer {
		return bufferedEncryptedText.subarray(this.authTagIndex, this.encryptedTextIndex);
	}

	private extractEncryptedMessage(bufferedEncryptedText: Buffer): Buffer {
		return bufferedEncryptedText.subarray(this.encryptedTextIndex);
	}
}
