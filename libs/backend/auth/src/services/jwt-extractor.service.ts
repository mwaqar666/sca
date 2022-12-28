import { Injectable } from "@nestjs/common";
import type { Key, Nullable } from "@sca-shared/utils";
import type { Request } from "express";
import type { Socket } from "socket.io";
import type { ParamsDictionary } from "express-serve-static-core";

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

	public extractJwtFromHttpRequestBody<T, F extends Key<T> = Key<T>>(request: Request<ParamsDictionary, any, T>, field: F): Nullable<T[F]> {
		return request.body[field] ?? null;
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
