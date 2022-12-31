import { Module } from "@nestjs/common";
import { DataAccessLayerModule } from "@sca-backend/data-access-layer";
import { SecurityModule } from "@sca-backend/security";
import { BaseModule } from "@sca-backend/utils";
import { AuthController } from "./controllers";
import * as Guards from "./guards";
import * as Services from "./services";

@Module({
	controllers: [AuthController],
	imports: [DataAccessLayerModule, SecurityModule],
	providers: [...Object.values(Services), ...Object.values(Guards)],
	exports: [...Object.values(Services), ...Object.values(Guards)],
})
export class AuthModule extends BaseModule {}
