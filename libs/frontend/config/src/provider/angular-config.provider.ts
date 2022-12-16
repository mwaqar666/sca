import type { FactoryProvider } from "@angular/core";
import { ConfigServiceInjectionToken } from "../const";
import { ConfigFactory } from "../factory";

export const AngularConfigProvider: FactoryProvider = {
	useFactory: ConfigFactory,
	provide: ConfigServiceInjectionToken,
};
