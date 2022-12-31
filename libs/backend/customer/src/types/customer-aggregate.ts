import type { TResolvedInjectables } from "@sca-backend/aggregate";
import type { CustomerUtilitiesAggregateDependencies } from "../config";

export type ICustomerUtilitiesAggregate = TResolvedInjectables<typeof CustomerUtilitiesAggregateDependencies>;
