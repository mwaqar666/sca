import { type OnGatewayDisconnect, type OnGatewayInit, WebSocketGateway } from "@nestjs/websockets";
import type { Server, Socket } from "socket.io";
import { AgentSocketConfig, AgentSocketPort } from "../config";

@WebSocketGateway(AgentSocketPort, AgentSocketConfig)
export class AgentGateway implements OnGatewayInit<Server>, OnGatewayDisconnect<Socket> {
	public afterInit(server: Server): void {
		console.log(server);
	}

	public handleDisconnect(client: Socket): void {
		console.log(client);
	}
}
