import type { ConfigValidationType } from "./config-validation.type";
import type { ConfigType } from "./config.type";

export type ConfigSchemaType = (validatedConfig: ConfigValidationType) => ConfigType;
