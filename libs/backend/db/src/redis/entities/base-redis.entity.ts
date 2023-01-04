import { Entity } from "redis-om";

export abstract class BaseRedisEntity<TEntity extends BaseRedisEntity<TEntity>> extends Entity {
	//
}
