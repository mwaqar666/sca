import { SequelizeService } from "@sca/db";
import { TInjectableRegister } from "@sca/utils";
import { ControlDbServiceMembers, ControlServiceMembers } from "../types";

export const ControlServiceConfig: TInjectableRegister<ControlServiceMembers> = {
	sequelize: SequelizeService,
};

export const ControlDbServiceConfig: TInjectableRegister<ControlDbServiceMembers> = {
	sequelize: SequelizeService,
};
