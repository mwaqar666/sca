import type { Nullable } from "@sca-shared/utils";

export interface IAccessToken {
	tokenIdentity: string;
	userUuid: string;
	userFirstName: string;
	userMiddleName: Nullable<string>;
	userLastName: string;
	userEmail: string;
	userDefaultProject: IAuthenticatedProject;
	userProjects: Array<IAuthenticatedProject>;
}

export interface IAuthenticatedProject {
	projectUuid: string;
	projectName: string;
	projectDomain: string;
}
