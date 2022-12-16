import { ConfigService } from "@nestjs/config";
import type { SequelizeModuleAsyncOptions, SequelizeModuleOptions } from "@nestjs/sequelize";
import { type ConfigType, type DatabaseConfig, ENTITIES } from "@sca-backend/config";

export const SequelizeNestConfig: SequelizeModuleAsyncOptions = {
	useFactory: async (configService: ConfigService<ConfigType, true>): Promise<SequelizeModuleOptions> => {
		const databaseConfig = configService.get<DatabaseConfig>("database");
		const { generator, ...databaseConnectionConfig } = databaseConfig;

		return {
			...databaseConnectionConfig,
			synchronize: generator === ENTITIES,
			autoLoadModels: true,
			minifyAliases: true,
		};
	},
	inject: [ConfigService<ConfigType, true>],
};
