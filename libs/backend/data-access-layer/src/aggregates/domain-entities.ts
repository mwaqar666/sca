import { CustomerEntity, ProjectCustomerEntity, ProjectEntity, ProjectUserEntity, TrackerEntity, UserEntity, UserTypeEntity } from "../domains";
import type { SequelizeBaseEntity } from "@sca-backend/db";
import type { Constructable } from "@sca-shared/utils";

export const DomainEntities: Array<Constructable<SequelizeBaseEntity<any>>> = [
	// Register entities here

	UserEntity,
	UserTypeEntity,

	ProjectEntity,
	ProjectUserEntity,
	ProjectCustomerEntity,

	CustomerEntity,

	TrackerEntity,
];
