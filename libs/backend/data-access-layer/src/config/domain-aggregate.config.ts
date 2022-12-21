import { SequelizeService } from "@sca-backend/db";
import { HashService } from "@sca-backend/security";
import { DomainExtensionsAggregateConst, DomainUtilitiesAggregateConst } from "../const";

export const DomainExtensionsAggregateDependencies = {
	sequelize: SequelizeService,
};

export const DomainUtilitiesAggregateDependencies = {
	hash: HashService,
};

export const DomainAggregateConfig = {
	[DomainExtensionsAggregateConst]: DomainExtensionsAggregateDependencies,
	[DomainUtilitiesAggregateConst]: DomainUtilitiesAggregateDependencies,
};
