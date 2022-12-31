import { Module } from "@nestjs/common";
import * as Dispatchers from "./dispatchers";
import { EntityKeyColumnStripperInterceptor } from "@sca-backend/db";

@Module({
	providers: [EntityKeyColumnStripperInterceptor, ...Object.values(Dispatchers)],
	exports: [...Object.values(Dispatchers)],
})
export class SocketModule {}
