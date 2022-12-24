import { CustomerIdentifierRepository, CustomerRepository, ProjectDefaultRepository, ProjectRepository, ProjectUserRepository, UserRepository, UserTypeRepository } from "../domains";

export const DomainRepositories = [
	// Register repositories here

	UserRepository,
	UserTypeRepository,
	ProjectRepository,
	ProjectDefaultRepository,
	ProjectUserRepository,
	CustomerIdentifierRepository,
	CustomerRepository,
];
