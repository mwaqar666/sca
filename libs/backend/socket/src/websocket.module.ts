import { Module } from "@nestjs/common";
import * as Dispatchers from "./dispatchers";

@Module({
	providers: [...Object.values(Dispatchers)],
})
export class WebsocketModule {}
