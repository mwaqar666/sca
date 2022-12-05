import { SequelizeNestConfig } from "~/config";
import { SequelizeConfig } from "~/migrator";
import { Module } from "@nestjs/common";
import { SequelizeModule } from "@nestjs/sequelize";
import { BaseModule } from "@sca/utils";

@Module({
	imports: [SequelizeModule.forRootAsync(SequelizeNestConfig)],
})
export class DbModule extends BaseModule {}
