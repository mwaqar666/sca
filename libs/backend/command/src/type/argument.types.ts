import { Key } from "@sca/utils";
import { BooleanArgumentDetails } from "./boolean-argument.types";
import { NumberArgumentDetails } from "./number-argument.types";
import { StringArgumentDetails } from "./string-argument.types";

export type PossibleKeyValueArgumentTypes = string | number | boolean;

export type ArgumentsHelp<TArgs extends KeyValueArgument = KeyValueArgument> = {
	[Argument in Key<TArgs>]: string;
};

export interface KeyValueArgument {
	[argumentKey: string]: PossibleKeyValueArgumentTypes;
}

export type CommandKeyValueArguments<TArgs extends KeyValueArgument = KeyValueArgument> = {
	[ArgumentName in Key<TArgs>]: ArgumentDetails<TArgs[ArgumentName]>;
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

export interface FlagArguments {
	[flagName: string]: boolean;
}
