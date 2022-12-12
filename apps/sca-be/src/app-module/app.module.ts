import { Module } from "@nestjs/common";
import { ConfigModule } from "@sca/config";
import { DbModule } from "@sca/db";
import { RedisModule } from "@sca/redis";
import { AggregateServicesModule, BaseModule } from "@sca/utils";
import { AggregateModuleConfig } from "./config";
import { AppService } from "./services";

@Module({
	imports: [ConfigModule, RedisModule, DbModule, AggregateServicesModule.forRoot(AggregateModuleConfig)],
	providers: [...Object.values([AppService])],
})
export class AppModule extends BaseModule {}
