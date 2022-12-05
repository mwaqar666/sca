import { CommandArguments, KeyValueArgument } from "@/type";
import { Optional } from "@sca/utils";
import * as process from "process";

export abstract class BaseCommand<T = any> {
	public constructor(protected readonly data: T) {}

	public commandArguments(): Optional<CommandArguments> {
		// Override to specify command arguments

		return;
	}

	public commandHelp(): string {
		console.error("Command help not specified!");

		process.exit(1);
	}

	public abstract commandName(): string;

	public abstract commandAction(commandArguments: Array<KeyValueArgument>, flags: Array<string>): Promise<void> | void;
}
