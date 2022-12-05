import { SequelizeQueryInterface } from "@/migrator/types";
import { DB_SCHEMA } from "@sca/config";
import { DateHelpers } from "@sca/utils";
import { DataTypes, Sequelize } from "sequelize";
import { InputMigrations, RunnableMigration, SequelizeStorage, Umzug, UmzugOptions } from "umzug";

export class MigrationConfigFactory {
	public static sequelizeStorageConfig(sequelize: Sequelize): SequelizeStorage {
		return new SequelizeStorage({
			sequelize,
			schema: process.env[DB_SCHEMA],
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
