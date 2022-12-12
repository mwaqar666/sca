import { SequelizeService } from "@sca/db";
import { TInjectableAggregates } from "@sca/utils";
import { DataAccessLayerAggregate, DomainLayerAggregate } from "../const";

export const AggregateModuleConfig: TInjectableAggregates = {
	[DomainLayerAggregate]: {
		sequelizeA: SequelizeService,
	},
	[DataAccessLayerAggregate]: {
		sequelizeB: SequelizeService,
	},
};
