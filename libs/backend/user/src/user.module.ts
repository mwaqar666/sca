import { Module } from "@nestjs/common";
import * as Gateways from "./gateways";
import * as SocketServices from "./services/socket";
import { DataAccessLayerModule } from "@sca-backend/data-access-layer";
import { AuthModule } from "@sca-backend/auth";
import { SecurityModule } from "@sca-backend/security";
import { ServiceBusModule } from "@sca-backend/service-bus";
import { AggregateServicesModule } from "@sca-backend/aggregate";
import { AgentAggregatesConfig } from "./config";
import { SocketModule } from "@sca-backend/socket";

@Module({
	imports: [AuthModule, SecurityModule, DataAccessLayerModule, ServiceBusModule, SocketModule, AggregateServicesModule.forRoot(AgentAggregatesConfig)],
	providers: [...Object.values(Gateways), ...Object.values(SocketServices)],
})
export class UserModule {}
