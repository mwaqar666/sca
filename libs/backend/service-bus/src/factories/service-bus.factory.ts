import type { FactoryProvider } from "@nestjs/common";
import { MessageBusService } from "../services";
import * as ServiceBuses from "../services/service-buses";
import type { IServiceBus } from "../types";
import type { Constructable } from "@sca-shared/utils";

export const ServiceBusFactories = Object.values(ServiceBuses).map((ServiceBus: Constructable<IServiceBus, [MessageBusService<object>]>): FactoryProvider => {
	return {
		provide: ServiceBus,
		useFactory: async (messageBusService: MessageBusService<object>) => {
			const serviceBusInstance = new ServiceBus(messageBusService);
			await serviceBusInstance.registerServiceBus();

			return serviceBusInstance;
		},
		inject: [MessageBusService],
	};
});
