import type { Nullable } from "@sca-shared/utils";

export interface IHandleCustomerRequest {
	customerCookie: Nullable<string>;
	projectDomain: string;
}

export interface IHandleCustomerResponse {
	customerToken: string;
	customerCookie: string;
}
