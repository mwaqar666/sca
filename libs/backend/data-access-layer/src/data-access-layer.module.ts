import { Module } from "@nestjs/common";
import { SequelizeModule } from "@nestjs/sequelize";
import { AggregateServicesModule } from "@sca-backend/aggregate";
import { BaseModule } from "@sca-backend/utils";
import { DomainDalServices, DomainEntities, DomainRepositories, DomainServices } from "./aggregates";
import { DomainAggregateConfig } from "./config";
import { DbModule, RedisDbModule } from "@sca-backend/db";
import { DomainRedisRepositoriesFactory } from "./factories";

@Module({
	imports: [DbModule, RedisDbModule, SequelizeModule.forFeature(DomainEntities), AggregateServicesModule.forRoot(DomainAggregateConfig)],
	providers: [...DomainRepositories, ...DomainRedisRepositoriesFactory, ...DomainServices, ...DomainDalServices],
	exports: [SequelizeModule, ...DomainDalServices],
})
export class DataAccessLayerModule extends BaseModule {}
