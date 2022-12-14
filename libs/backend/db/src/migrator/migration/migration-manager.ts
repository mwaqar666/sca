import { FileHelpers } from "@sca-backend/utils";
import type { Constructable } from "@sca-shared/utils";
import { Sequelize } from "sequelize";
import { type InputMigrations, type MigrationParams, Umzug } from "umzug";
import { MigrationCommandProvider } from "../command-provider";
import { MigrationConfigFactory, SequelizeConfig } from "../config";
import type { SequelizeQueryInterface } from "../types";
import type { BaseMigration } from "./base.migration";

export class MigrationManager {
	private _umzug: Umzug<SequelizeQueryInterface>;
	private _sequelize: Sequelize;
	private _migrations: InputMigrations<SequelizeQueryInterface>;

	public constructor() {
		this.instantiateSequelize();

		this.createMigrationFilesResolver();

		this.instantiateUmzug();

		this.loadMigrationCommandProvider();
	}

	private _migrationCommandProvider: MigrationCommandProvider;

	public get migrationCommandProvider(): MigrationCommandProvider {
		return this._migrationCommandProvider;
	}

	private instantiateSequelize(): void {
		this._sequelize = new Sequelize(SequelizeConfig);
	}

	private createMigrationFilesResolver(): void {
		this._migrations = {
			glob: ["dist/**/[0-9]*.migration.js", { cwd: process.cwd() }],
			resolve: ({ name, path, context }: MigrationParams<SequelizeQueryInterface>) => {
				const migrationImport: Promise<{ default: Constructable<BaseMigration> }> = import(`${path}`);
				const [fileName] = FileHelpers.extension(name);

				return {
					name: fileName,
					up: async () => {
						const concreteMigration = await migrationImport;
						const migrationClassInstance = new concreteMigration.default();
						await migrationClassInstance.up(context);
					},
					down: async () => {
						const concreteMigration = await migrationImport;
						const migrationClassInstance = new concreteMigration.default();
						await migrationClassInstance.down(context);
					},
				};
			},
		};
	}

	private instantiateUmzug(): void {
		this._umzug = new Umzug(MigrationConfigFactory.umzugConfig(this._sequelize, this._migrations));
	}

	private loadMigrationCommandProvider() {
		this._migrationCommandProvider = new MigrationCommandProvider(this._umzug);
	}
}

const migrationManager = new MigrationManager();

export const MigrationManagerCommandProvider = migrationManager.migrationCommandProvider;
