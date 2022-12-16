import { COOKIES, DEVELOPMENT, HTTP, HTTPS, LOCAL_STORAGE, PRODUCTION, QUALITY_ASSURANCE, USER_ACCEPTANCE_TESTING } from "../const";

export type ApiProtocols = typeof HTTP | typeof HTTPS;
export type StorageDrivers = typeof COOKIES | typeof LOCAL_STORAGE;

export type Env = typeof DEVELOPMENT | typeof QUALITY_ASSURANCE | typeof USER_ACCEPTANCE_TESTING | typeof PRODUCTION;

export interface ApiConfig {
	protocol: ApiProtocols;
	baseUrl: string;
}

export interface StorageConfig {
	driver: StorageDrivers;
}

export interface ConfigType {
	env: Env;

	api: ApiConfig;

	storage: StorageConfig;
}
