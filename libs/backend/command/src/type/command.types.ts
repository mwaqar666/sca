import { BaseCommand, BaseCommandProvider } from "../base";
import { ArgumentsHelp, CommandKeyValueArguments, KeyValueArgument } from "./argument.types";

export type CommandType<T = unknown, TArgs extends KeyValueArgument = KeyValueArgument> = new (data: T) => BaseCommand<T, TArgs>;

export type LoadableCommands = Array<Promise<CommandType | BaseCommandProvider>>;

export interface CommandHelp<TArgs extends KeyValueArgument = KeyValueArgument> {
	commandDescription: string;
	argumentDescription: ArgumentsHelp<TArgs>;
}

export interface LoadedCommandArguments {
	commandName: string;
	keyValueArguments: Record<string, string>;
	flagArguments: Array<string>;
}

export interface CommandArguments<TArgs extends KeyValueArgument = KeyValueArgument> {
	keyValueArguments?: CommandKeyValueArguments<TArgs>;
	flagArguments?: Array<string>;
}
