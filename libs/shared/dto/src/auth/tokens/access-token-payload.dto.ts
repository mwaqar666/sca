import { Nullable } from "@sca/utils";

export class AccessTokenPayloadDto {
	public secretIdentity: string;
	public userFirstName: string;
	public userMiddleName: Nullable<string>;
	public userLastName: string;
	public userUuid: string;
}
