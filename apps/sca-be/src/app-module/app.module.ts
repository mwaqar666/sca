import { Module } from "@nestjs/common";
import { ConfigModule } from "@sca/config";
import { DbModule } from "@sca/db";
import { RedisModule } from "@sca/redis";
import { BaseModule, ControlFlowModule } from "@sca/utils";
import { ControlDbServiceConfig, ControlServiceConfig } from "./config/control-config";
import { AppService } from "./services";

@Module({
	imports: [ConfigModule, RedisModule, DbModule, ControlFlowModule.forRoot(ControlServiceConfig, ControlDbServiceConfig)],
	providers: [...Object.values([AppService])],
})
export class AppModule extends BaseModule {}
