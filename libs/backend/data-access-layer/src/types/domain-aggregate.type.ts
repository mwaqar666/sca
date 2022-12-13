import { SequelizeService } from "@sca/db";

export interface IDomainAggregate {
	sequelize: SequelizeService;
}
