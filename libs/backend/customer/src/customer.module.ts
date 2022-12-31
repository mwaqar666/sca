import { Module } from "@nestjs/common";
import { DataAccessLayerModule } from "@sca-backend/data-access-layer";
import * as Controllers from "./controllers";
import * as Services from "./services";
import * as SocketServices from "./services/socket";
import * as Gateways from "./gateways";
import { AggregateServicesModule } from "@sca-backend/aggregate";
import { CustomerAggregatesConfig } from "./config";
import { AuthModule } from "@sca-backend/auth";
import { SecurityModule } from "@sca-backend/security";
import { SocketModule } from "@sca-backend/socket";

@Module({
	imports: [AuthModule, SecurityModule, DataAccessLayerModule, SocketModule, AggregateServicesModule.forRoot(CustomerAggregatesConfig)],
	controllers: [...Object.values(Controllers)],
	providers: [...Object.values(Services), ...Object.values(SocketServices), ...Object.values(Gateways)],
})
export class CustomerModule {}
