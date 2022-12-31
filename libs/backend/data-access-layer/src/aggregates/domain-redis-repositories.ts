import { CustomerRedisRepository } from "../domains";
import type { Constructable } from "@sca-shared/utils";
import type { IRedisRepository } from "@sca-backend/db";

export const DomainRedisRepositories: Array<Constructable<IRedisRepository>> = [
	// Register redis repositories here

	CustomerRedisRepository,
];
