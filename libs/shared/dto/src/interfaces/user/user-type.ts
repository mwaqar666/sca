import type { Nullable } from "@sca-shared/utils";

export enum UserTypeEnum {
	PlatformAdministrators,
	ProjectUsers,
	ProjectCustomers,
}

export interface IUserType {
	userTypeId: number;
	userTypeUuid: string;
	userTypeIdentifier: UserTypeEnum;
	userTypeIsActive: boolean;
	userTypeCreatedAt: Date;
	userTypeUpdatedAt: Date;
	userTypeDeletedAt: Nullable<Date>;
}
