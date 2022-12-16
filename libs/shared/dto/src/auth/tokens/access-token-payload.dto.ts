import type { Nullable } from "@sca-backend/utils";

export class AccessTokenPayloadDto {
	public tokenIdentity: string;
	public userUuid: string;
	public userFirstName: string;
	public userMiddleName: Nullable<string>;
	public userLastName: string;
	public userEmail: string;
	public userDefaultProject: AuthenticatedProject;
	public userProjects: Array<AuthenticatedProject>;
}

export class AuthenticatedProject {
	public projectUuid: string;
	public projectName: string;
	public projectDomain: string;
}
