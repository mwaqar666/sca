import type { TResolvedInjectables } from "@sca-backend/aggregate";
import { DomainAggregateDependencies } from "../config";

export type IDomainAggregate = TResolvedInjectables<typeof DomainAggregateDependencies>;
