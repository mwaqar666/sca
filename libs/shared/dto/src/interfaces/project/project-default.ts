import type { Nullable } from "@sca-shared/utils";

export interface IProjectDefault {
	projectDefaultId: number;
	projectDefaultUuid: string;
	projectDefaultUserId: number;
	projectDefaultProjectId: number;
	projectDefaultCreatedAt: Date;
	projectDefaultUpdatedAt: Date;
	projectDefaultDeletedAt: Nullable<Date>;
}
