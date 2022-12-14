import { DB_SCHEMA } from "@sca-backend/config";
import { DateHelpers } from "@sca-backend/utils";
import { EnvExtractor } from "@sca-shared/utils";
import { DataTypes, type Sequelize } from "sequelize";
import { type InputMigrations, type RunnableMigration, SequelizeStorage, Umzug, type UmzugOptions } from "umzug";
import type { SequelizeQueryInterface } from "../types";

export class MigrationConfigFactory {
	public static sequelizeStorageConfig(sequelize: Sequelize): SequelizeStorage {
		return new SequelizeStorage({
			sequelize,
			schema: EnvExtractor.env(DB_SCHEMA),
			tableName: "migrations",
			columnName: "migrationName",
			columnType: DataTypes.STRING(100),
		});
	}

	public static umzugConfig(sequelize: Sequelize, migrations: InputMigrations<SequelizeQueryInterface>): UmzugOptions<SequelizeQueryInterface> {
		const umzugInitialConfiguration = MigrationConfigFactory.initialUmzugConfig(sequelize, migrations);
		const initialUmzugInstance = new Umzug(umzugInitialConfiguration);

		return {
			...initialUmzugInstance.options,
			migrations: async (context: SequelizeQueryInterface) => {
				const migrations = (await initialUmzugInstance.migrations(context)).concat();

				return migrations.sort((a: RunnableMigration<SequelizeQueryInterface>, b: RunnableMigration<SequelizeQueryInterface>) => {
					const [timeStampSegmentA, timeStampSegmentB] = [a.name.slice(0, 23), b.name.slice(0, 23)];

					const [dateA, dateB] = [DateHelpers.parseTimeStamp(timeStampSegmentA), DateHelpers.parseTimeStamp(timeStampSegmentB)];

					return dateA.getTime() > dateB.getTime() ? 1 : -1;
				});
			},
		};
	}

	private static initialUmzugConfig(sequelize: Sequelize, migrations: InputMigrations<SequelizeQueryInterface>): UmzugOptions<SequelizeQueryInterface> {
		return {
			migrations,
			context: sequelize.getQueryInterface() as unknown as SequelizeQueryInterface,
			storage: MigrationConfigFactory.sequelizeStorageConfig(sequelize),
			logger: console,
		};
	}
}
