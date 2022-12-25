import type { Nullable } from "@sca-shared/utils";
import type { ITokenIdentity } from "./token-identity";

export interface IAccessTokenPayload extends ITokenIdentity {
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
