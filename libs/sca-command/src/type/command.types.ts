import { BaseCommand, BaseCommandProvider } from "~/base";

export type CommandType<T = any> = new (data: T) => BaseCommand<T>;

export type LoadableCommands = Array<Promise<CommandType | BaseCommandProvider>>;

export interface BaseCommandArgumentDetails {
	required?: boolean;
}

export interface StringCommandArgumentDetails extends BaseCommandArgumentDetails {
	type: "string";
	defaultValue?: string;
}

export interface NumberCommandArgumentDetails extends BaseCommandArgumentDetails {
	type: "number";
	defaultValue?: number;
}

export interface BooleanCommandArgumentDetails extends BaseCommandArgumentDetails {
	type: "boolean";
	defaultValue?: boolean;
}

export type CommandArgumentDetails = StringCommandArgumentDetails | NumberCommandArgumentDetails | BooleanCommandArgumentDetails;

export interface CommandKeyValueArguments {
	[argumentName: string]: CommandArgumentDetails;
}

export interface CommandArguments {
	keyValueArguments?: CommandKeyValueArguments;
	flagArguments?: Array<string>;
}

export interface KeyValueArgument {
	key: string;
	value: string | number | boolean;
}

export interface LoadedCommandArguments {
	commandName: string;
	keyValueArguments: Array<KeyValueArgument>;
	flagArguments: Array<string>;
}
