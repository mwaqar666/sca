import type { FactoryProvider } from "@angular/core";
import { ConfigService, COOKIES, LOCAL_STORAGE } from "@sca-frontend/config";
import type { Constructable } from "@sca-shared/utils";
import { StorageInjectionToken } from "../const";
import type { StorageInterface } from "../interfaces";
import { CookieStorageService, LocalStorageService } from "../services";

export const StorageDrivers: Record<string, Constructable<StorageInterface>> = {
	[COOKIES]: CookieStorageService,
	[LOCAL_STORAGE]: LocalStorageService,
};

export const StorageDriverFactory = (configService: ConfigService) => {
	const storageConfig = configService.get("storage");
	const storageDriverService = StorageDrivers[storageConfig.driver];
	return new storageDriverService();
};

export const StorageDriverProvider: FactoryProvider = {
	provide: StorageInjectionToken,
	useFactory: StorageDriverFactory,
	deps: [ConfigService],
};
