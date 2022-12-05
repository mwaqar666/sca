import { SequelizeService } from "@sca/db";

export type ControlDbServiceMembers = {
	sequelize: typeof SequelizeService;
};

export type ControlServiceMembers = {
	sequelize: typeof SequelizeService;
};
