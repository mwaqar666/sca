import { Module } from "@nestjs/common";
import { RedisModule } from "@sca-backend/redis";
import { ServiceBusFactories } from "./factories";

@Module({
	imports: [RedisModule],
	providers: [...ServiceBusFactories],
	exports: [...ServiceBusFactories],
})
export class ServiceBusModule {}
