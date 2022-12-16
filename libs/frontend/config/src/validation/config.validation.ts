import * as Joi from "joi";
import {
	API_BASE_URL,
	API_PROTOCOL,
	ConfigDefaultsConst,
	COOKIES,
	DEVELOPMENT,
	HTTP,
	HTTPS,
	LOCAL_STORAGE,
	NODE_ENV,
	PRODUCTION,
	QUALITY_ASSURANCE,
	STORAGE_DRIVER,
	USER_ACCEPTANCE_TESTING,
} from "../const";
import type { ConfigValidationType } from "../types";

export const ConfigValidation: Joi.ObjectSchema<ConfigValidationType> = Joi.object<ConfigValidationType>({
	[NODE_ENV]: Joi.string().optional().valid(DEVELOPMENT, QUALITY_ASSURANCE, USER_ACCEPTANCE_TESTING, PRODUCTION).default(ConfigDefaultsConst.Environment),

	[API_PROTOCOL]: Joi.string().optional().valid(HTTP, HTTPS).default(ConfigDefaultsConst.Api[API_PROTOCOL]),
	[API_BASE_URL]: Joi.string().required(),

	[STORAGE_DRIVER]: Joi.string().optional().valid(COOKIES, LOCAL_STORAGE).default(ConfigDefaultsConst.Storage[STORAGE_DRIVER]),
});
