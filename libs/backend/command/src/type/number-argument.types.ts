import type { BaseArgumentDetails } from "./argument.types";

export type NumberArgumentDetails = RequiredNumberArgumentDetails | OptionalNumberArgumentDetails;

export interface OptionalNumberArgumentDetails extends BaseArgumentDetails<false> {
	type: "number";
	defaultValue: number;
}

export interface RequiredNumberArgumentDetails extends BaseArgumentDetails<true> {
	type: "number";
}
