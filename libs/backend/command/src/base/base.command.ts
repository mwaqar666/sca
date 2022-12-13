import { Optional } from "@sca/utils";
import { CommandArguments, CommandHelp, FlagArguments, KeyValueArgument } from "../type";

export abstract class BaseCommand<T = unknown, TArgs extends KeyValueArgument = KeyValueArgument> {
	public constructor(protected readonly data: T) {}

	public commandArguments(): Optional<CommandArguments<TArgs>> {
		// Override to specify command arguments

		return;
	}

	public abstract commandHelp(): CommandHelp<TArgs>;

	public abstract commandName(): string;

	public abstract commandAction(commandArguments: TArgs, flags: FlagArguments): Promise<void> | void;
}
