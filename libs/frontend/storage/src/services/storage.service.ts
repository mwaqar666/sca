import { Inject, Injectable } from "@angular/core";
import { StorageInjectionToken } from "../const";
import type { StorageInterface } from "../interfaces";

@Injectable()
export class StorageService implements StorageInterface {
	constructor(@Inject(StorageInjectionToken) private storageService: StorageInterface) {}

	public getItem(key: string): string | null {
		return this.storageService.getItem(key);
	}

	public setItem<TOptions extends Record<string, string>>(key: string, value: string, options?: TOptions): string {
		return this.storageService.setItem(key, value, options);
	}

	public getObject<TValue = unknown>(key: string): TValue | null {
		return this.storageService.getObject<TValue>(key);
	}

	public setObject<TValue = unknown, TOptions extends Record<string, string> = any>(key: string, value: TValue, options?: TOptions): TValue {
		return this.storageService.setObject<TValue, TOptions>(key, value, options);
	}

	public flush(): void {
		return this.storageService.flush();
	}
}
