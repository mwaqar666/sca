import { SequelizeService } from "@sca/db";

export type IDomainLayerAggregate = {
	sequelizeA: SequelizeService;
};

export type IDataAccessLayerAggregate = {
	sequelizeB: SequelizeService;
};
