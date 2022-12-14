import type { BaseCommand, BaseCommandProvider } from "../base";
import type { ArgumentsHelp, CommandFlagArguments, CommandKeyValueArguments, FlagArgument, KeyValueArgument } from "./argument.types";

export type CommandType<T = unknown, KVArgs extends KeyValueArgument = KeyValueArgument, FArgs extends FlagArgument = FlagArgument> = new (data: T) => BaseCommand<T, KVArgs, FArgs>;

export type LoadableCommands = Array<Promise<CommandType | BaseCommandProvider>>;

export interface CommandHelp<KVArgs extends KeyValueArgument = KeyValueArgument> {
	commandDescription: string;
	argumentDescription?: ArgumentsHelp<KVArgs>;
}

export interface LoadedCommandArguments {
	commandName: string;
	keyValueArguments: Record<string, string>;
	flagArguments: Record<string, boolean>;
}

export interface CommandArguments<KVArgs extends KeyValueArgument = KeyValueArgument, FArgs extends FlagArgument = FlagArgument> {
	keyValueArguments?: CommandKeyValueArguments<KVArgs>;
	flagArguments?: CommandFlagArguments<FArgs>;
}
