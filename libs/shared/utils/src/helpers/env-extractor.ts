import { AnyObject } from "../types";

export class EnvExtractor {
	public static env<TExpectedReturn>(key: string): TExpectedReturn;
	public static env<TExpectedReturn>(environment: AnyObject, key: string): TExpectedReturn;
	public static env<TExpectedReturn>(environment: string | AnyObject, key?: string): TExpectedReturn {
		if (typeof environment === "string") return process.env[environment] as TExpectedReturn;

		return environment[key as string] as TExpectedReturn;
	}
}
