import { CustomerService, ProjectCustomerService, ProjectDefaultService, ProjectService, ProjectUserService, TrackerService, UserService, UserTypeService } from "../domains";
import type { Type } from "@nestjs/common";

export const DomainServices: Array<Type> = [
	// Register data services here

	UserService,
	UserTypeService,
	ProjectService,
	ProjectDefaultService,
	ProjectUserService,
	ProjectCustomerService,
	CustomerService,
	TrackerService,
];
