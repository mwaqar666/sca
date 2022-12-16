import * as Joi from "joi";
import { API_BASE_URL, API_PROTOCOL, NODE_ENV, STORAGE_DRIVER } from "../const";
import type { ApiProtocols, Env, StorageDrivers } from "./config.type";

export interface ConfigValidationType {
	[NODE_ENV]: Joi.StringSchema<Env>;

	[API_PROTOCOL]: Joi.StringSchema<ApiProtocols>;
	[API_BASE_URL]: Joi.StringSchema;

	[STORAGE_DRIVER]: Joi.StringSchema<StorageDrivers>;
}
