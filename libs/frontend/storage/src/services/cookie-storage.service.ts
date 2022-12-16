import { Injectable } from "@angular/core";
import type { StorageInterface } from "../interfaces";

@Injectable()
export class CookieStorageService implements StorageInterface {
	private cookies: Record<string, string> = {};

	public constructor() {
		this.loadCookies();
	}

	public getItem(key: string): string | null {
		const value = this.cookies[key];

		return value ?? null;
	}

	public setItem<TOptions extends Record<string, string> = any>(key: string, value: string, options?: TOptions): string {
		this.cookies[key] = value;

		this.persistCookie<TOptions>(key, value, options);

		return value;
	}

	public getObject<TValue = unknown>(key: string): TValue | null {
		const value = this.cookies[key];

		return value ? (JSON.parse(value) as TValue) : null;
	}

	public setObject<TValue = unknown, TOptions extends Record<string, string> = any>(key: string, value: TValue, options?: TOptions): TValue {
		const jsonObject = JSON.stringify(value);

		this.cookies[key] = jsonObject;

		this.persistCookie<TOptions>(key, jsonObject, options);

		return value;
	}

	public flush(): void {
		this.cookies = {};

		document.cookie.split(";").map((eachCookie: string) => {
			const [key, value] = eachCookie.split("=");

			this.persistCookie(key, value, { expires: new Date(0).toUTCString() });
		});
	}

	private loadCookies() {
		document.cookie.split(";").map((eachCookie: string) => {
			const [key, value] = eachCookie.split("=");

			this.cookies[key] = value;
		});
	}

	private persistCookie<TOptions extends Record<string, string>>(key: string, value: string, options?: TOptions): void {
		let cookieToPersist = `${key}=${value}`;

		if (options) {
			for (const [optionKey, optionValue] of Object.entries(options)) {
				cookieToPersist += `;${optionKey}=${optionValue}`;
			}
		}

		document.cookie = cookieToPersist;
	}
}
