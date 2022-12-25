import type { CustomerEntity, UserEntity } from "../../domains";

export class FailedAuthReasonUser {
	authEntity: null;
	authErrorReason: "user";
}

export class FailedAuthReasonProject {
	authEntity: null;
	authErrorReason: "project";
}

export class SuccessfulAuthWithUserAndProject {
	authEntity: UserEntity;
	authErrorReason: null;
}

export class FailedAuthReasonCustomer {
	authEntity: null;
	authErrorReason: "customer";
}

export class SuccessfulAuthWithCustomerAndProject {
	authEntity: CustomerEntity;
	authErrorReason: null;
}
