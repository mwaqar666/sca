import { Module } from "@nestjs/common";
import { SequelizeModule } from "@nestjs/sequelize";
import { BaseModule } from "@sca-backend/utils";
import { SequelizeNestConfig } from "./config";

@Module({
	imports: [SequelizeModule.forRootAsync(SequelizeNestConfig)],
})
export class DbModule extends BaseModule {}
