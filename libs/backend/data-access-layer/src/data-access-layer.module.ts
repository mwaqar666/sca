import { Module } from "@nestjs/common";
import { SequelizeModule } from "@nestjs/sequelize";
import { AggregateServicesModule } from "@sca-backend/aggregate";
import { BaseModule } from "@sca-backend/utils";
import { DomainDalServices, DomainEntities, DomainRepositories, DomainServices } from "./aggregates";
import { DomainAggregateConfig } from "./config";

@Module({
	imports: [SequelizeModule.forFeature(DomainEntities), AggregateServicesModule.forRoot(DomainAggregateConfig)],
	providers: [...DomainRepositories, ...DomainDalServices, ...DomainServices],
	exports: [SequelizeModule, ...DomainRepositories, ...DomainDalServices, ...DomainServices],
})
export class DataAccessLayerModule extends BaseModule {}
