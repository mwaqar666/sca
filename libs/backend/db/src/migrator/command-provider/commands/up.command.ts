import { BaseCommand } from "@sca/command";
import { MigrationCommandProviderData } from "../../types";

export class UpCommand extends BaseCommand<MigrationCommandProviderData> {
	public override commandHelp(): string {
		return `
			Runs all migrations

			Syntax:
			=======
			up
		`;
	}

	public override commandName(): string {
		return "migration:up";
	}

	public override async commandAction(): Promise<void> {
		await this.data.umzug.up();
	}
}
