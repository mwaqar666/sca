export class EnvExtractorHelper {
	public static env<TExpectedReturn>(key: string): TExpectedReturn {
		return process.env[key] as TExpectedReturn;
	}
}
