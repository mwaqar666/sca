export interface IRedisRepository {
	initializeRepository(): Promise<void>;
}
