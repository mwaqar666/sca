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
