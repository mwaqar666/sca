import { Injectable } from "@angular/core";
import type { StorageInterface } from "../interfaces";

@Injectable()
export class LocalStorageService implements StorageInterface {
	private storageEntries: Record<string, string> = {};

	public constructor() {
		this.loadEntriesFromLocalStorage();
	}

	public getItem(key: string): string | null {
		const value = this.storageEntries[key];

		return value ?? null;
	}

	public setItem(key: string, value: string): string {
		this.storageEntries[key] = value;

		localStorage.setItem(key, value);

		return value;
	}

	public getObject<TValue = unknown>(key: string): TValue | null {
		const value = this.storageEntries[key];

		return value ? (JSON.parse(value) as TValue) : null;
	}

	public setObject<TValue = unknown>(key: string, value: TValue): TValue {
		const jsonObject = JSON.stringify(value);

		this.storageEntries[key] = jsonObject;

		localStorage.setItem(key, jsonObject);

		return value;
	}

	public flush(): void {
		this.storageEntries = {};

		localStorage.clear();
	}

	private loadEntriesFromLocalStorage() {
		for (const [storeKey, storeValue] of Object.entries(localStorage)) {
			this.storageEntries[storeKey] = storeValue;
		}
	}
}
