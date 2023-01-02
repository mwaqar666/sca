import { AgentRedisService, CustomerRedisService, CustomerService, ProjectCustomerService, ProjectService, ProjectUserService, TrackerService, UserService, UserTypeService } from "../domains";
import type { Type } from "@nestjs/common";

export const DomainServices: Array<Type> = [
	// Register data services here

	UserService,
	UserTypeService,
	AgentRedisService,

	ProjectService,
	ProjectUserService,
	ProjectCustomerService,

	CustomerService,
	CustomerRedisService,

	TrackerService,
];
