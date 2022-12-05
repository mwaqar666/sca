import { RedisService } from "~/services";
import { Module } from "@nestjs/common";
import { BaseModule } from "@sca/utils";

@Module({
	providers: [RedisService],
	exports: [RedisService],
})
export class RedisModule extends BaseModule {}
