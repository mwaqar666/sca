import { Type } from "@nestjs/common";
import { Key } from "../types";

export type TInjectable = {
	[injectableName: string]: Type;
};

export type TInjectableAggregates = {
	[aggregateName: string]: TInjectable;
};

export type TResolvedInjectable = {
	[InjectableName in Key<TInjectable>]: InstanceType<TInjectable[InjectableName]>;
};
