import { Injectable } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { PassportConfig } from "../config";
import { ACCESS_TOKEN_STRATEGY } from "../const";

@Injectable()
export class AccessTokenGuard extends AuthGuard(ACCESS_TOKEN_STRATEGY) {
	public constructor() {
		super(PassportConfig);
	}
}
