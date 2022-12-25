export class JsonHelper {
	public static stringify(): string;
	public static stringify<T extends object>(data: T): string;
	public static stringify<T extends object>(data?: T): string {
		const rawData = data ?? {};
		return JSON.stringify(rawData);
	}

	public static parse<T>(json: string): T {
		return <T>JSON.parse(json);
	}
}
