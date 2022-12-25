import { Injectable } from "@nestjs/common";
import type { Nullable } from "@sca-shared/utils";
import type { Request } from "express";
import type { Socket } from "socket.io";

@Injectable()
export class JwtExtractorService {
	public extractJwtFromHttpRequestHeader(request: Request): Nullable<string> {
		const authorizationHeader = request.headers["authorization"];

		if (!authorizationHeader) return null;

		const [scheme, token] = authorizationHeader.split(" ");

		if (!scheme || !token) return null;

		if (scheme.toLowerCase() !== "bearer") return null;

		return token;
	}

	public extractJwtFromSocketRequestHeader(socket: Socket): Nullable<string> {
		const authorizationHeader = socket.handshake.auth;

		if (!authorizationHeader || !authorizationHeader["token"]) return null;

		const [scheme, token] = authorizationHeader["token"].split(" ");

		if (!scheme || !token) return null;

		if (scheme.toLowerCase() !== "bearer") return null;

		return token;
	}
}
