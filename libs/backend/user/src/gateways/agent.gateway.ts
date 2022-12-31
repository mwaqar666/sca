import { type OnGatewayDisconnect, type OnGatewayInit, WebSocketGateway } from "@nestjs/websockets";
import { AgentSocketConfig, AgentSocketPort } from "../config";
import type { Server, Socket } from "socket.io";
import { UseGuards } from "@nestjs/common";
import { AccessTokenSocketGuard } from "@sca-backend/auth";

@UseGuards(AccessTokenSocketGuard)
@WebSocketGateway(AgentSocketPort, AgentSocketConfig)
export class AgentGateway implements OnGatewayInit<Server>, OnGatewayDisconnect<Socket> {
	public afterInit(server: Server): void {
		console.log(server);
	}

	public handleDisconnect(socket: Socket): void {
		console.log(socket);
	}
}
