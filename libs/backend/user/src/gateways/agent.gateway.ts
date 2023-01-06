import { ConnectedSocket, type OnGatewayDisconnect, type OnGatewayInit, SubscribeMessage, WebSocketGateway } from "@nestjs/websockets";
import { AgentSocketConfig, AgentSocketPort } from "../config";
import type { Server, Socket } from "socket.io";
import { UseGuards } from "@nestjs/common";
import { AccessTokenSocketGuard, AuthUserSocket } from "@sca-backend/auth";
import { AgentConnectionService, AgentNotificationService, AgentQueryService } from "../services/socket";
import { IncomingAgent, type IProjectCustomersResponseDto, ProjectCustomers } from "@sca-shared/dto";

@UseGuards(AccessTokenSocketGuard)
@WebSocketGateway(AgentSocketPort, AgentSocketConfig)
export class AgentGateway implements OnGatewayInit<Server>, OnGatewayDisconnect<Socket> {
	public constructor(
		// Dependencies

		private readonly agentQueryService: AgentQueryService,
		private readonly agentConnectionService: AgentConnectionService,
		private readonly agentNotificationService: AgentNotificationService,
	) {}

	@SubscribeMessage(IncomingAgent)
	public async handleIncomingAgent(@ConnectedSocket() agentSocket: AuthUserSocket): Promise<void> {
		return await this.agentConnectionService.handleIncomingAgent(agentSocket);
	}

	@SubscribeMessage(ProjectCustomers)
	public async retrieveListOfCurrentProjectCustomers(@ConnectedSocket() agentSocket: AuthUserSocket): Promise<IProjectCustomersResponseDto> {
		return await this.agentQueryService.fetchCustomersForAgentOfProject(agentSocket);
	}

	public afterInit(server: Server): void {
		this.agentQueryService.setServer(server);
		this.agentConnectionService.setServer(server);
		this.agentNotificationService.setServer(server);
	}

	public async handleDisconnect(socket: Socket): Promise<void> {
		await this.agentConnectionService.handleOutgoingConnection(socket);
	}
}
