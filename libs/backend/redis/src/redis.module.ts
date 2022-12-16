import { Module } from "@nestjs/common";
import { BaseModule } from "@sca-backend/utils";
import { RedisService } from "./services";

@Module({
	providers: [RedisService],
	exports: [RedisService],
})
export class RedisModule extends BaseModule {}
