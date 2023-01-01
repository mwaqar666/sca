import { type IRedisConnection, RedisService } from "@sca-backend/redis";
import { JsonHelper, type Nullable } from "@sca-shared/utils";
import { filter, first, map, type Observable, Subject } from "rxjs";
import { v4 } from "uuid";
import type { IMessageWithData } from "../types";

export abstract class MessageBusService<Bus extends MessageBusService<Bus>> {
	private publisherChannel: string;
	private subscriberChannel: string;

	private publisherConnection: IRedisConnection;
	private subscriberConnection: IRedisConnection;

	private readonly messageWithDataStream: Subject<string>;

	protected constructor(
		// Dependencies

		private readonly redisBusService: RedisService,
	) {
		this.messageWithDataStream = new Subject<string>();
	}

	public async registerServiceBus(this: Bus): Promise<void> {
		const busName = this.constructor.name;

		this.publisherChannel = this.channelName(busName, "pub");
		this.subscriberChannel = this.channelName(busName, "sub");

		this.publisherConnection = await this.redisBusService.getConnection(this.publisherChannel);
		this.subscriberConnection = await this.redisBusService.getConnection(this.subscriberChannel);

		await this.attachListenerToSubscriberChannel();
	}

	public async publishMessage(message: string): Promise<void>;
	public async publishMessage<T>(message: string, data: Nullable<T>): Promise<void>;
	public async publishMessage<T>(message: string, data?: Nullable<T>): Promise<void> {
		const passengerData = JsonHelper.stringify<IMessageWithData<Nullable<T>>>({ message, data: data ?? null });

		await this.publisherConnection.redis.publish(this.publisherChannel, passengerData);
	}

	public listenForMessage<T = null>(messageName: string): Observable<T> {
		return this.messageWithDataStream.pipe(
			map((messageWithData: string) => JsonHelper.parse<IMessageWithData<T>>(messageWithData)),
			filter(({ message }: IMessageWithData<T>) => message === messageName),
			map(({ data }: IMessageWithData<T>) => data),
		);
	}

	public listenForMessageOnce<T = null>(messageName: string): Observable<T> {
		return this.listenForMessage<T>(messageName).pipe(first());
	}

	private async attachListenerToSubscriberChannel(): Promise<void> {
		return await this.subscriberConnection.redis.subscribe(this.subscriberChannel, (messageWithData: string) => {
			this.messageWithDataStream.next(messageWithData);
		});
	}

	private channelName(busName: string, mode: "pub" | "sub"): string {
		return `__${busName}_${v4()}_${mode}__`;
	}
}
