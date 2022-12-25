import { Module } from "@nestjs/common";
import { DataAccessLayerModule } from "@sca-backend/data-access-layer";
import { SecurityModule } from "@sca-backend/security";
import { CustomerController } from "./controllers";
import { CustomerHandleService, CustomerInfoService, CustomerTokenService } from "./services";

@Module({
	imports: [DataAccessLayerModule, SecurityModule],
	controllers: [CustomerController],
	providers: [CustomerHandleService, CustomerInfoService, CustomerTokenService],
})
export class CustomerModule {}
