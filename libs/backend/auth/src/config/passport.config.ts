import { IAuthModuleOptions } from "@nestjs/passport";
import { AuthenticatedUserEntity } from "../const";

export const PassportConfig: IAuthModuleOptions = {
	property: AuthenticatedUserEntity,
};
