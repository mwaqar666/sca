import { Module } from "@nestjs/common";
import { JwtModule } from "@nestjs/jwt";
import { BaseModule } from "@sca/utils";
import * as Services from "./services";

@Module({
	imports: [JwtModule],
	providers: [...Object.values(Services)],
	exports: [...Object.values(Services)],
})
export class SecurityModule extends BaseModule {}
