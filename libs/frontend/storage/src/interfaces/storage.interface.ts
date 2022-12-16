export interface StorageInterface {
	getItem(key: string): string | null;

	setItem<TOptions extends Record<string, string> = any>(key: string, value: string, options?: TOptions): string;

	getObject<TValue = unknown>(key: string): TValue | null;

	setObject<TValue = unknown, TOptions extends Record<string, string> = any>(key: string, value: TValue, options?: TOptions): TValue;

	flush(): void;
}
