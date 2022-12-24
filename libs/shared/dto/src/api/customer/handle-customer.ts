import { Nullable } from "@sca-shared/utils";

export interface IHandleCustomerRequest {
	customerCookie: Nullable<string>;
}

export interface IHandleCustomerResponse {
	customerToken: string;
}
