import { Injectable } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { PassportConfig } from "../config";
import { REFRESH_TOKEN_STRATEGY } from "../const";

@Injectable()
export class RefreshTokenGuard extends AuthGuard(REFRESH_TOKEN_STRATEGY) {
	public constructor() {
		super(PassportConfig);
	}
}
