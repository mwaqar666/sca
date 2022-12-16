import { Inject, Injectable } from "@angular/core";
import type { Key } from "@sca-shared/utils";
import { ConfigServiceInjectionToken } from "../const";
import type { ConfigType } from "../types";

@Injectable()
export class ConfigService {
	public constructor(
		// Dependencies

		@Inject(ConfigServiceInjectionToken) private readonly validatedConfig: ConfigType,
	) {}

	public get<T extends Key<ConfigType>>(configKey: T): ConfigType[T] {
		return this.validatedConfig[configKey];
	}
}
