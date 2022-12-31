import { type BaseRedisEntity, type IRedisRepository, RedisStorageRepository } from "@sca-backend/db";
import type { Constructable } from "@sca-shared/utils";
import { DomainRedisRepositories } from "../aggregates";
import type { FactoryProvider } from "@nestjs/common";

export const DomainRedisRepositoriesFactory = DomainRedisRepositories.map((DomainRedisRepository: Constructable<IRedisRepository>): FactoryProvider => {
	return {
		provide: DomainRedisRepository,
		useFactory: async (redisStorageService: RedisStorageRepository<BaseRedisEntity<any>>) => {
			const domainRedisRepositoryInstance = new DomainRedisRepository(redisStorageService);
			await domainRedisRepositoryInstance.initializeRepository();

			return domainRedisRepositoryInstance;
		},
		inject: [RedisStorageRepository],
	};
});
