import { Injectable } from "@nestjs/common";
import { v4 } from "uuid";

@Injectable()
export class UuidService {
	public createUuid(): string {
		return v4();
	}
}
