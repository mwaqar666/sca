export interface IMessageWithData<T> {
	message: string;
	data: T;
}

export interface IServiceBus {
	registerServiceBus(): Promise<void>;
}
