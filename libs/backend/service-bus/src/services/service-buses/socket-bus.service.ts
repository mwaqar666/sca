import { Injectable } from "@nestjs/common";
import type { IServiceBus } from "../../types";
import { MessageBusService } from "../message-bus.service";

@Injectable()
export class SocketBusService implements IServiceBus {
	public constructor(
		// Dependencies

		private readonly messageBusService: MessageBusService<SocketBusService>,
	) {}

	public async registerServiceBus(): Promise<void> {
		await this.messageBusService.registerServiceBus(this);
	}
}
