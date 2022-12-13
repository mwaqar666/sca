import { Module } from "@nestjs/common";
import { PassportModule } from "@nestjs/passport";
import { DataAccessLayerModule } from "@sca/data-access-layer";
import { SecurityModule } from "@sca/security";
import { BaseModule } from "@sca/utils";
import { AuthController } from "./controllers";
import * as Factories from "./factories";
import * as Guards from "./guards";
import * as Services from "./services";
import * as Strategies from "./strategies";

@Module({
	controllers: [AuthController],
	imports: [PassportModule, DataAccessLayerModule, SecurityModule],
	providers: [...Object.values(Services), ...Object.values(Factories), ...Object.values(Strategies), ...Object.values(Guards)],
	exports: [...Object.values(Guards)],
})
export class AuthModule extends BaseModule {}
