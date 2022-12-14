import { BaseArgumentDetails } from "./argument.types";

export type StringArgumentDetails = RequiredStringArgumentDetails | OptionalStringArgumentDetails;

export interface OptionalStringArgumentDetails extends BaseArgumentDetails<false> {
	type: "string";
	defaultValue: string;
}

export interface RequiredStringArgumentDetails extends BaseArgumentDetails<true> {
	type: "string";
}
