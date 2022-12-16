import { DB_DATABASE, DB_DIALECT, DB_HOST, DB_PASSWORD, DB_PORT, DB_SCHEMA, DB_USERNAME } from "@sca-backend/config";
import { EnvExtractor } from "@sca-shared/utils";
import type { Options } from "sequelize";

export const SequelizeConfig: Options = {
	dialect: EnvExtractor.env(DB_DIALECT),
	username: EnvExtractor.env(DB_USERNAME),
	password: EnvExtractor.env(DB_PASSWORD),
	host: EnvExtractor.env(DB_HOST),
	port: parseInt(EnvExtractor.env(DB_PORT), 10),
	database: EnvExtractor.env(DB_DATABASE),
	schema: EnvExtractor.env(DB_SCHEMA),
};
