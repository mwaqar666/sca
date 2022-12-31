export type Key<T> = keyof T;

export type Optional<T> = undefined | T;

export type Nullable<T> = null | T;

export type AnyObject = { [key: string]: any };

export type PositiveFilterCondition<T, P extends Key<T>, C> = T[P] extends C ? P : never;

export type InverseFilterCondition<T, P extends Key<T>, C> = T[P] extends C ? never : P;

export type PositiveFilter<T, C> = { [P in Key<T>]: PositiveFilterCondition<T, P, C> }[Key<T>];

export type InverseFilter<T, C> = { [P in Key<T>]: InverseFilterCondition<T, P, C> }[Key<T>];

export type FilterWhere<T, C> = Pick<T, PositiveFilter<T, C>>;

export type FilterWhereNot<T, C> = Pick<T, InverseFilter<T, C>>;

export type NullableOptional<T> = Optional<T> | Nullable<T>;

export type OptionalOnly<T, K extends Key<T>> = Omit<T, K> & Partial<Pick<T, K>>;

export type Constructable<T, TArgs extends any[] = any> = new (...args: TArgs) => T;

export type PartialExcept<T, K extends keyof T> = Partial<T> & Required<Pick<T, K>>;

export type Without<T, R> = { [K in Exclude<Key<T>, Key<R>>]?: never };

export type SingleExclusiveUnion<T, U> = T | U extends object ? (Without<T, U> & U) | (Without<U, T> & T) : T | U;

export type ExclusiveUnion<T extends Array<any>> = T extends [infer Only]
	? Only
	: T extends [infer First, infer Second, ...infer Rest]
	? ExclusiveUnion<[SingleExclusiveUnion<First, Second>, ...Rest]>
	: never;
