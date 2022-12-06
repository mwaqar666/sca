import { Type } from "@nestjs/common";
import { Key } from "../../types";

export type TInjectable = {
	[injectableName: string]: Type;
};

export type TInjectableRegister<T extends TInjectable> = {
	[InjectableName in Key<T>]: T[InjectableName];
};

export type TResolvedInjectable<T extends TInjectable> = {
	[InjectableName in Key<T>]: InstanceType<T[InjectableName]>;
};

export type TInjectableToken<T extends TInjectable> = T[Key<T>];

export type TResolvedInjectableToken<T extends TInjectable> = InstanceType<TInjectableToken<T>>;
