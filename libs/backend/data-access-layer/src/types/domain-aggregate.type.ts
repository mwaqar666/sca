import type { TResolvedInjectables } from "@sca/aggregate";
import { DomainAggregateDependencies } from "../config";

export type IDomainAggregate = TResolvedInjectables<typeof DomainAggregateDependencies>;
