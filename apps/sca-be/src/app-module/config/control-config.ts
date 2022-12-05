import { ControlDbServiceMembers, ControlServiceMembers } from "@/app-module/types";
import { SequelizeService } from "@sca/db";
import { TInjectableRegister } from "@sca/utils";

export const ControlServiceConfig: TInjectableRegister<ControlServiceMembers> = {
	sequelize: SequelizeService,
};

export const ControlDbServiceConfig: TInjectableRegister<ControlDbServiceMembers> = {
	sequelize: SequelizeService,
};
