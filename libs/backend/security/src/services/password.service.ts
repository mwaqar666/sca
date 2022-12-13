import { Injectable } from "@nestjs/common";
import { HashService } from "./hash.service";

@Injectable()
export class PasswordService {
	public constructor(
		// Dependencies

		private readonly hashService: HashService,
	) {}

	public async hashPassword(plainPassword: string): Promise<string> {
		return await this.hashService.hashString(plainPassword);
	}

	public async verifyPassword(plainPassword: string, hashedPassword: string): Promise<boolean> {
		return await this.hashService.hashEquals(plainPassword, hashedPassword);
	}
}
