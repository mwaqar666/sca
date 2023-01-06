import type { Nullable } from "@sca-shared/utils";

export interface IUser {
	userId: number;
	userUuid: string;
	userUserTypeId: number;
	userFirstName: string;
	userMiddleName: Nullable<string>;
	userLastName: string;
	userEmail: string;
	userPassword: string;
	userIsActive: boolean;
	userCreatedAt: Date;
	userUpdatedAt: Date;
	userDeletedAt: Nullable<Date>;
}
