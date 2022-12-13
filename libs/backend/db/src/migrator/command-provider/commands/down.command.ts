import { BaseCommand, CommandHelp } from "@sca/command";
import { MigrationCommandProviderData } from "../../types";

export class DownCommand extends BaseCommand<MigrationCommandProviderData> {
	public override commandHelp(): CommandHelp {
		return {
			commandDescription: "Rolls back single migration",
			argumentDescription: {},
		};
	}

	public override commandName(): string {
		return "migration:down";
	}

	public override async commandAction(): Promise<void> {
		await this.data.umzug.down();
	}
}
