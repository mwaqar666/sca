import { Module } from "@nestjs/common";
import { AuthModule } from "@sca-backend/auth";
import { ConfigModule } from "@sca-backend/config";
import { DbModule } from "@sca-backend/db";
import { RedisModule } from "@sca-backend/redis";
import { BaseModule } from "@sca-backend/utils";
import { AppService } from "./services";

@Module({
	imports: [ConfigModule, RedisModule, DbModule, AuthModule],
	providers: [...Object.values([AppService])],
})
export class AppModule extends BaseModule {}
