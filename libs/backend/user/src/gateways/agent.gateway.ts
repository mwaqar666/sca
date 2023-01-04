import { ConnectedSocket, type OnGatewayDisconnect, type OnGatewayInit, SubscribeMessage, WebSocketGateway } from "@nestjs/websockets";
import { AgentSocketConfig, AgentSocketPort } from "../config";
import type { Server, Socket } from "socket.io";
import { UseGuards } from "@nestjs/common";
import { AccessTokenSocketGuard, AuthUserSocket } from "@sca-backend/auth";
import { AgentConnectionService, AgentNotificationService } from "../services/socket";
import { IncomingAgent } from "@sca-shared/dto";

@UseGuards(AccessTokenSocketGuard)
@WebSocketGateway(AgentSocketPort, AgentSocketConfig)
export class AgentGateway implements OnGatewayInit<Server>, OnGatewayDisconnect<Socket> {
	public constructor(
		// Dependencies

		private readonly agentConnectionService: AgentConnectionService,
		private readonly agentNotificationService: AgentNotificationService,
	) {}

	@SubscribeMessage(IncomingAgent)
	public async handleIncomingAgent(@ConnectedSocket() agentSocket: AuthUserSocket): Promise<void> {
		return await this.agentConnectionService.handleIncomingAgent(agentSocket);
	}

	public afterInit(server: Server): void {
		this.agentConnectionService.setServer(server);
		this.agentNotificationService.setServer(server);
	}

	public async handleDisconnect(socket: Socket): Promise<void> {
		await this.agentConnectionService.handleOutgoingConnection(socket);
	}
}
