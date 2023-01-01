import { ExceptionHandlerService } from "@sca-backend/utils";
import type { TInjectableAggregates } from "@sca-backend/aggregate";
import { AgentUtilitiesAggregateConst } from "../const";

export const AgentUtilitiesAggregateDependencies = {
	exceptionHandler: ExceptionHandlerService,
};

export const AgentAggregatesConfig: TInjectableAggregates = {
	[AgentUtilitiesAggregateConst]: AgentUtilitiesAggregateDependencies,
};
