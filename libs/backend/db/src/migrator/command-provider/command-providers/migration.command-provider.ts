import { BaseCommandProvider, CommandType } from "@sca/command";
import { Umzug } from "umzug";
import { MigrationCommandProviderData, SequelizeQueryInterface } from "../../types";

export class MigrationCommandProvider extends BaseCommandProvider<MigrationCommandProviderData> {
	public constructor(public readonly umzug: Umzug<SequelizeQueryInterface>) {
		super({ umzug });
	}

	public override provide(): Array<Promise<CommandType<MigrationCommandProviderData>>> {
		const commandsDirectory = import("../commands");

		return [
			// Register migrator commands here

			commandsDirectory.then(({ UpCommand }) => UpCommand),
			commandsDirectory.then(({ DownCommand }) => DownCommand),
			commandsDirectory.then(({ CreateCommand }) => CreateCommand),
		];
	}
}
