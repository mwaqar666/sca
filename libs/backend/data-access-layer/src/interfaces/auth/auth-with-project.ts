import type { CustomerEntity, UserEntity } from "../../domains";

export interface IFailedAuthReasonUser {
	authEntity: null;
	authErrorReason: "user";
}

export interface IFailedAuthReasonProject {
	authEntity: null;
	authErrorReason: "project";
}

export interface ISuccessfulAuthWithUserAndProject {
	authEntity: UserEntity;
	authErrorReason: null;
}

export interface IFailedAuthReasonCustomer {
	authEntity: null;
	authErrorReason: "customer";
}

export interface ISuccessfulAuthWithCustomerAndProject {
	authEntity: CustomerEntity;
	authErrorReason: null;
}
