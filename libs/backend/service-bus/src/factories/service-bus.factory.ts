import type { FactoryProvider } from "@nestjs/common";
import type { MessageBusService } from "../services";
import * as ServiceBuses from "../services/service-buses";
import type { Constructable } from "@sca-shared/utils";
import { RedisService } from "@sca-backend/redis";

export const ServiceBusFactories = Object.values(ServiceBuses).map((ServiceBus: Constructable<MessageBusService<any>, [RedisService]>): FactoryProvider => {
	return {
		provide: ServiceBus,
		useFactory: async (redisService: RedisService) => {
			const serviceBusInstance = new ServiceBus(redisService);
			await serviceBusInstance.registerServiceBus();

			return serviceBusInstance;
		},
		inject: [RedisService],
	};
});
