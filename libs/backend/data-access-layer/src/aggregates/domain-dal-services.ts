import { CustomerProjectIdentityService, UserProjectIdentityService } from "../dal-services";
import type { Type } from "@nestjs/common";

export const DomainDalServices: Array<Type> = [
	// Register domain access services here

	UserProjectIdentityService,
	CustomerProjectIdentityService,
];
