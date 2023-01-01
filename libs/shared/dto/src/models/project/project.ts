import type { Nullable } from "@sca-shared/utils";

export interface IProject {
	readonly projectId: number;
	readonly projectUuid: string;
	projectName: string;
	projectImage: Nullable<string>;
	projectDomain: string;
	projectIsDefault: boolean;
	projectIsActive: boolean;
	projectCreatedAt: Date;
	projectUpdatedAt: Date;
	projectDeletedAt: Nullable<Date>;
}
