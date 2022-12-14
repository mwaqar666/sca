import { BaseArgumentDetails } from "./argument.types";

export type BooleanArgumentDetails = RequiredBooleanArgumentDetails | OptionalBooleanArgumentDetails;

export interface OptionalBooleanArgumentDetails extends BaseArgumentDetails<false> {
	type: "boolean";
	defaultValue: boolean;
}

export interface RequiredBooleanArgumentDetails extends BaseArgumentDetails<true> {
	type: "boolean";
}
