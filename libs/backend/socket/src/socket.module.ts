import { Module } from "@nestjs/common";
import * as Dispatchers from "./dispatchers";
import { ServiceBusModule } from "@sca-backend/service-bus";

@Module({
	imports: [ServiceBusModule],
	providers: [...Object.values(Dispatchers)],
	exports: [...Object.values(Dispatchers)],
})
export class SocketModule {}
