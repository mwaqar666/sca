import { Module } from "@nestjs/common";
import { AuthModule } from "@sca/auth";
import { ConfigModule } from "@sca/config";
import { DbModule } from "@sca/db";
import { RedisModule } from "@sca/redis";
import { BaseModule } from "@sca/utils";
import { AppService } from "./services";

@Module({
	imports: [ConfigModule, RedisModule, DbModule, AuthModule],
	providers: [...Object.values([AppService])],
})
export class AppModule extends BaseModule {}
