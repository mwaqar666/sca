import { Injectable } from "@angular/core";
import type { CanActivate } from "@angular/router";
import { StorageService } from "@sca-frontend/storage";
import { AccessTokenStorageKey } from "../const";

@Injectable()
export class GuestGuard implements CanActivate {
	public constructor(
		// Dependencies

		private readonly storageService: StorageService,
	) {}

	public async canActivate(): Promise<boolean> {
		const accessToken = this.storageService.getItem(AccessTokenStorageKey);

		return !accessToken;
	}
}
