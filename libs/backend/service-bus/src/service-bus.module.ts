import { Module } from "@nestjs/common";
import { RedisModule } from "@sca-backend/redis";
import { MessageBusService } from "./services";
import { ServiceBusFactories } from "./factories";

@Module({
	imports: [RedisModule],
	providers: [MessageBusService, ...ServiceBusFactories],
	exports: [...ServiceBusFactories],
})
export class ServiceBusModule {}
