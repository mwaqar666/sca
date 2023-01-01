import { CustomerRepository, ProjectCustomerRepository, ProjectDefaultRepository, ProjectRepository, ProjectUserRepository, TrackerRepository, UserRepository, UserTypeRepository } from "../domains";
import type { Constructable } from "@sca-shared/utils";
import type { BaseRepository } from "@sca-backend/db";

export const DomainRepositories: Array<Constructable<BaseRepository<any>>> = [
	// Register repositories here

	UserRepository,
	UserTypeRepository,

	ProjectRepository,
	ProjectDefaultRepository,
	ProjectUserRepository,
	ProjectCustomerRepository,

	CustomerRepository,

	TrackerRepository,
];
