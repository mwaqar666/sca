import { ConfigService } from "@nestjs/config";
import { SequelizeModuleAsyncOptions, SequelizeModuleOptions } from "@nestjs/sequelize";
import { ConfigType, DatabaseConfig } from "@sca/config";

export const SequelizeNestConfig: SequelizeModuleAsyncOptions = {
	useFactory: async (configService: ConfigService<ConfigType, true>): Promise<SequelizeModuleOptions> => {
		return {
			...configService.get<DatabaseConfig>("database"),
			synchronize: false,
			autoLoadModels: true,
			minifyAliases: true,
		};
	},
	inject: [ConfigService<ConfigType, true>],
};
