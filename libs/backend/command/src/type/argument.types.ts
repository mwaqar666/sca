import type { Key } from "@sca/utils";
import type { BooleanArgumentDetails } from "./boolean-argument.types";
import type { NumberArgumentDetails } from "./number-argument.types";
import type { StringArgumentDetails } from "./string-argument.types";

export type PossibleKeyValueArgumentTypes = string | number | boolean;

export type ArgumentsHelp<KVArgs extends KeyValueArgument = KeyValueArgument, FArgs extends FlagArgument = FlagArgument> = {
	keyValueArguments?: KeyValueArgumentsHelp<KVArgs>;
	flagArguments?: FlagArgumentsHelp<FArgs>;
};

export type KeyValueArgumentsHelp<KVArgs extends KeyValueArgument = KeyValueArgument> = {
	[KVArgument in Key<KVArgs>]: string;
};

export type FlagArgumentsHelp<FArgs extends FlagArgument = FlagArgument> = {
	[KVArgument in Key<FArgs>]: string;
};

export interface KeyValueArgument {
	[argumentName: string]: PossibleKeyValueArgumentTypes;
}

export interface FlagArgument {
	[argumentName: string]: boolean;
}

export type CommandKeyValueArguments<KVArgs extends KeyValueArgument = KeyValueArgument> = {
	[ArgumentName in Key<KVArgs>]: ArgumentDetails<KVArgs[ArgumentName]>;
};

export type CommandFlagArguments<FArgs extends FlagArgument = FlagArgument> = {
	[ArgumentName in Key<FArgs>]: FArgs[ArgumentName];
};

export interface BaseArgumentDetails<TRequired extends boolean> {
	required: TRequired;
}

export type ArgumentDetails<TValue extends PossibleKeyValueArgumentTypes = PossibleKeyValueArgumentTypes> = TValue extends string
	? StringArgumentDetails
	: TValue extends number
	? NumberArgumentDetails
	: TValue extends boolean
	? BooleanArgumentDetails
	: never;
