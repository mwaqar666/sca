import { BaseCommand } from "@sca/command";
import { MigrationCommandProviderData } from "../../types";

export class CreateCommand extends BaseCommand<MigrationCommandProviderData> {
	public override commandHelp(): string {
		return `
			Creates migration

			Syntax:
			=======
			create module=[moduleName] migration=[migrationName]

			Arguments:
			==========
			module: Specifies the module in which to create the migration
			migration: Specifies the migration file name
		`;
	}

	public override commandName(): string {
		return "create";
	}

	public override async commandAction(): Promise<void> {
		throw new Error("Method not implemented.");
	}
}
