import { Nullable } from "@sca/utils";

export class AccessTokenPayloadDto {
	public tokenIdentity: string;
	public userUuid: string;
	public userFirstName: string;
	public userMiddleName: Nullable<string>;
	public userLastName: string;
	public userEmail: string;
	public projectUuid: string;
	public projectName: string;
	public projectDomain: string;
}
