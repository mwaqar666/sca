import { BaseCommand } from "@sca/command";
import { MigrationCommandProviderData } from "../../types";

export class DownCommand extends BaseCommand<MigrationCommandProviderData> {
	public override commandHelp(): string {
		return `
			Rolls back one migration

			Syntax:
			=======
			down
		`;
	}

	public override commandName(): string {
		return "migration:down";
	}

	public override async commandAction(): Promise<void> {
		await this.data.umzug.down();
	}
}
