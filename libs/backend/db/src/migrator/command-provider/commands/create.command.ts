import { BaseCommand, CommandArguments, CommandHelp, OptionalStringArgumentDetails, RequiredStringArgumentDetails } from "@sca/command";
import { DateHelpers, FileHelpers, PathHelpers } from "@sca/utils";
import { MigrationCommandProviderData } from "../../types";
import { CreateArgument } from "../command-arguments";

export class CreateCommand extends BaseCommand<MigrationCommandProviderData, CreateArgument> {
	public override commandArguments(): CommandArguments<CreateArgument> {
		const requiredStringArgumentDetails: RequiredStringArgumentDetails = { required: true, type: "string" };
		const optionalStringArgumentDetails: OptionalStringArgumentDetails = { required: false, type: "string", defaultValue: "libs" };

		return {
			keyValueArguments: {
				path: requiredStringArgumentDetails,
				target: optionalStringArgumentDetails,
				migration: requiredStringArgumentDetails,
			},
		};
	}

	public commandHelp(): CommandHelp<CreateArgument> {
		return {
			commandDescription: "Creates a migration file",
			argumentDescription: {
				keyValueArguments: {
					path: "Path to create a migration",
					target: "Project type. This can be apps or libs",
					migration: "Migration file name",
				},
			},
		};
	}

	public override commandName(): string {
		return "migration:create";
	}

	public async commandAction(commandArguments: CreateArgument): Promise<void> {
		const target = commandArguments.target;
		const path = commandArguments.path;
		const migrationName = commandArguments.migration;

		const timeStamp = DateHelpers.createTimeStamp();
		const migrationFileName = `${timeStamp}_${migrationName}.migration.ts`;
		const migrationFilePath = PathHelpers.rootPath(`${target}/${path}/${migrationFileName}`);
		const migrationTemplateFilePath = PathHelpers.libraryPath("backend/db/src/migrator/migration/migration-template.txt");

		await FileHelpers.copyFile(migrationTemplateFilePath, migrationFilePath);
	}
}
