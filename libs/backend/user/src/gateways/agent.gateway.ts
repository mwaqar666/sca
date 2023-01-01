import { type OnGatewayDisconnect, type OnGatewayInit, WebSocketGateway } from "@nestjs/websockets";
import { AgentSocketConfig, AgentSocketPort } from "../config";
import type { Server, Socket } from "socket.io";
import { UseGuards } from "@nestjs/common";
import { AccessTokenSocketGuard } from "@sca-backend/auth";
import { AgentNotificationService } from "../services/socket";

@UseGuards(AccessTokenSocketGuard)
@WebSocketGateway(AgentSocketPort, AgentSocketConfig)
export class AgentGateway implements OnGatewayInit<Server>, OnGatewayDisconnect<Socket> {
	public constructor(
		// Dependencies

		private readonly agentNotificationService: AgentNotificationService,
	) {}

	public afterInit(server: Server): void {
		this.agentNotificationService.setServer(server);
	}

	public handleDisconnect(socket: Socket): void {
		console.log(socket);
	}
}
