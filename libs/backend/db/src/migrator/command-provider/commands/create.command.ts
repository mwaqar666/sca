import { BaseCommand, CommandArguments, CommandHelp, FlagArguments, OptionalStringArgumentDetails, RequiredStringArgumentDetails } from "@sca/command";
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
				path: "Path to create a migration",
				target: "Project type",
				migration: "Migration file name",
			},
		};
	}

	public override commandName(): string {
		return "migration:create";
	}

	public commandAction(commandArguments: CreateArgument, flags: FlagArguments): void | Promise<void> {
		//
	}
}
