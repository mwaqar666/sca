import { Optional } from "@sca/utils";
import { CommandArguments, CommandHelp, FlagArgument, KeyValueArgument } from "../type";

export abstract class BaseCommand<T = unknown, TArgs extends KeyValueArgument = KeyValueArgument, FArgs extends FlagArgument = FlagArgument> {
	public constructor(protected readonly data: T) {}

	public commandArguments(): Optional<CommandArguments<TArgs, FArgs>> {
		// Override to specify command arguments

		return;
	}

	public abstract commandHelp(): CommandHelp<TArgs>;

	public abstract commandName(): string;

	public abstract commandAction(commandArguments: TArgs, flags: FArgs): Promise<void> | void;
}
