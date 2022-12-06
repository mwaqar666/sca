import { ControlDbServiceConfig, ControlServiceConfig } from "~/app-module/config/control-config";
import * as Services from "~/app-module/services";
import { Module } from "@nestjs/common";
import { ConfigModule } from "@sca/config";
import { DbModule } from "@sca/db";
import { RedisModule } from "@sca/redis";
import { BaseModule, ControlFlowModule } from "@sca/utils";

@Module({
	imports: [ConfigModule, RedisModule, DbModule, ControlFlowModule.forRoot(ControlServiceConfig, ControlDbServiceConfig)],
	providers: [...Object.values(Services)],
})
export class AppModule extends BaseModule {}
