import { ConfigService } from "@nestjs/config";
import { SequelizeModuleAsyncOptions, SequelizeModuleOptions } from "@nestjs/sequelize";
import { ConfigType, DatabaseConfig, ENTITIES } from "@sca/config";

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
