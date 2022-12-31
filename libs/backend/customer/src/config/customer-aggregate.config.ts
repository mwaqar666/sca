import type { TInjectableAggregates } from "@sca-backend/aggregate";
import { ExceptionHandlerService } from "@sca-backend/utils";
import { CustomerUtilitiesAggregateConst } from "../const";

export const CustomerUtilitiesAggregateDependencies = {
	exceptionHandler: ExceptionHandlerService,
};

export const CustomerAggregatesConfig: TInjectableAggregates = {
	[CustomerUtilitiesAggregateConst]: CustomerUtilitiesAggregateDependencies,
};
