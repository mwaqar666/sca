import { Injectable } from "@nestjs/common";
import { MessageBusService } from "../message-bus.service";
import { RedisService } from "@sca-backend/redis";

@Injectable()
export class SocketBusService extends MessageBusService<SocketBusService> {
	public constructor(
		// Dependencies

		private readonly redisService: RedisService,
	) {
		super(redisService);
	}
}
