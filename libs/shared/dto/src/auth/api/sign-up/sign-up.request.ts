import type { Nullable } from "@sca-shared/utils";

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
