import type { TResolvedInjectables } from "@sca-backend/aggregate";
import { DomainExtensionsAggregateDependencies, DomainUtilitiesAggregateDependencies } from "../config";

export type IDomainExtensionsAggregate = TResolvedInjectables<typeof DomainExtensionsAggregateDependencies>;
export type IDomainUtilitiesAggregate = TResolvedInjectables<typeof DomainUtilitiesAggregateDependencies>;
