import type { Nullable } from "@sca/utils";

export interface IProjectUserSignUpRequestDto {
	userFirstName: string;
	userMiddleName: Nullable<string>;
	userLastName: string;
	userEmail: string;
	userPassword: string;
	userPasswordConfirm: string;
}
