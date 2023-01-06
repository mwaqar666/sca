import type { Nullable } from "@sca-shared/utils";

export interface IProjectUser {
	projectUserId: number;
	projectUserUuid: string;
	projectUserUserId: number;
	projectUserProjectId: number;
	projectUserParentId: Nullable<number>;
	projectUserCreatedAt: Date;
	projectUserUpdatedAt: Date;
	projectUserDeletedAt: Nullable<Date>;
}
