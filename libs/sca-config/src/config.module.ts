import { NestConfigConfig } from "@/config";
import { Module } from "@nestjs/common";
import { ConfigModule as NestConfigModule } from "@nestjs/config";
import { BaseModule } from "@sca/utils";

@Module({
	imports: [NestConfigModule.forRoot(NestConfigConfig)],
})
export class ConfigModule extends BaseModule {}
