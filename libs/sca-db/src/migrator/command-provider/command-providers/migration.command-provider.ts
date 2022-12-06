import { MigrationCommandProviderData, SequelizeQueryInterface } from "~/migrator/types";
import { BaseCommandProvider, CommandType } from "@sca/command";
import { Umzug } from "umzug";

export class MigrationCommandProvider extends BaseCommandProvider<MigrationCommandProviderData> {
	public constructor(public readonly umzug: Umzug<SequelizeQueryInterface>) {
		super({ umzug });
	}

	public override provide(): Array<Promise<CommandType<MigrationCommandProviderData>>> {
		const commandsDirectory = import("~/migrator/command-provider/commands");

		return [
			// Register migrator commands here

			commandsDirectory.then(({ UpCommand }) => UpCommand),
			commandsDirectory.then(({ DownCommand }) => DownCommand),
			commandsDirectory.then(({ CreateCommand }) => CreateCommand),
		];
	}
}
