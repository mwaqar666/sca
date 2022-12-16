import { SequelizeService } from "@sca-backend/db";
import { DomainAggregateConst } from "../const";

export const DomainAggregateDependencies = {
	sequelize: SequelizeService,
};

export const DomainAggregateConfig = {
	[DomainAggregateConst]: DomainAggregateDependencies,
};
