import {
	AgentRedisService,
	CustomerRedisService,
	CustomerService,
	ProjectCustomerService,
	ProjectDefaultService,
	ProjectService,
	ProjectUserService,
	TrackerService,
	UserService,
	UserTypeService,
} from "../domains";
import type { Type } from "@nestjs/common";

export const DomainServices: Array<Type> = [
	// Register data services here

	UserService,
	UserTypeService,
	AgentRedisService,

	ProjectService,
	ProjectDefaultService,
	ProjectUserService,
	ProjectCustomerService,

	CustomerService,
	CustomerRedisService,

	TrackerService,
];
