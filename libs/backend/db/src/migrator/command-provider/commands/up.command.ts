import { BaseCommand, CommandHelp } from "@sca/command";
import { MigrationCommandProviderData } from "../../types";

export class UpCommand extends BaseCommand<MigrationCommandProviderData> {
	public override commandHelp(): CommandHelp {
		return {
			commandDescription: "Runs all migrations",
			argumentDescription: {},
		};
	}

	public override commandName(): string {
		return "migration:up";
	}

	public override async commandAction(): Promise<void> {
		await this.data.umzug.up();
	}
}
