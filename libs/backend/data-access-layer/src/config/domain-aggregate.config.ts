import { SequelizeService } from "@sca-backend/db";
import { HashService, UuidService } from "@sca-backend/security";
import { DomainExtensionsAggregateConst, DomainUtilitiesAggregateConst } from "../const";
import type { TInjectableAggregates } from "@sca-backend/aggregate";

export const DomainExtensionsAggregateDependencies = {
	sequelize: SequelizeService,
};

export const DomainUtilitiesAggregateDependencies = {
	hash: HashService,
	uuid: UuidService,
};

export const DomainAggregateConfig: TInjectableAggregates = {
	[DomainExtensionsAggregateConst]: DomainExtensionsAggregateDependencies,
	[DomainUtilitiesAggregateConst]: DomainUtilitiesAggregateDependencies,
};
