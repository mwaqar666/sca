import type { Type } from "@nestjs/common";
import type { Key } from "@sca-shared/utils";

export type TInjectable = {
	[injectableName: string]: Type;
};

export type TInjectableAggregates = {
	[aggregateName: string]: TInjectable;
};

export type TResolvedInjectable = {
	[InjectableName in Key<TInjectable>]: InstanceType<TInjectable[InjectableName]>;
};

export type TResolvedInjectables<T extends TInjectable> = {
	[InjectableName in Key<T>]: InstanceType<T[InjectableName]>;
};
