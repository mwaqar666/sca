import type { Nullable } from "@sca-shared/utils";
import type { ISignInResponse } from "./sign-in";

export interface ISignUpRequest {
	userFirstName: string;
	userMiddleName: Nullable<string>;
	userLastName: string;
	userEmail: string;
	userPassword: string;
	userPasswordConfirm: string;
	projectName: string;
	projectDomain: string;
}

export type ISignUpResponse = ISignInResponse;
