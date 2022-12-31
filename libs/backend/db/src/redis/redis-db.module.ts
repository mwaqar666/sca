import { Module } from "@nestjs/common";
import { RedisStorageRepository } from "./redis-storage.repository";
import { RedisModule } from "@sca-backend/redis";

@Module({
	imports: [RedisModule],
	providers: [RedisStorageRepository],
	exports: [RedisStorageRepository],
})
export class RedisDbModule {}
