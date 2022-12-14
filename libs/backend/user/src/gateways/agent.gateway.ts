import { ConnectedSocket, MessageBody, type OnGatewayDisconnect, type OnGatewayInit, SubscribeMessage, WebSocketGateway } from "@nestjs/websockets";
import { AgentSocketConfig, AgentSocketPort } from "../config";
import type { Server, Socket } from "socket.io";
import { UseGuards } from "@nestjs/common";
import { AccessTokenSocketGuard, AuthUserSocket } from "@sca-backend/auth";
import { AgentConnectionService, AgentNotificationService, AgentQueryService, AgentSessionService } from "../services/socket";
import { AgentRequestEvents, type IProjectCustomersResponse } from "@sca-shared/dto";

@UseGuards(AccessTokenSocketGuard)
@WebSocketGateway(AgentSocketPort, AgentSocketConfig)
export class AgentGateway implements OnGatewayInit<Server>, OnGatewayDisconnect<Socket> {
	public constructor(
		// Dependencies

		private readonly agentQueryService: AgentQueryService,
		private readonly agentSessionService: AgentSessionService,
		private readonly agentConnectionService: AgentConnectionService,
		private readonly agentNotificationService: AgentNotificationService,
	) {}

	@SubscribeMessage(AgentRequestEvents.IncomingAgent)
	public async handleIncomingAgent(@ConnectedSocket() agentSocket: AuthUserSocket): Promise<void> {
		return await this.agentConnectionService.handleIncomingAgent(agentSocket);
	}

	@SubscribeMessage(AgentRequestEvents.ProjectCustomers)
	public async retrieveListOfCurrentProjectCustomers(@ConnectedSocket() agentSocket: AuthUserSocket): Promise<IProjectCustomersResponse> {
		return await this.agentQueryService.fetchCustomersForAgentOfProject(agentSocket);
	}

	@SubscribeMessage(AgentRequestEvents.StartSessionWithCustomer)
	public async startSessionWithCustomer(@ConnectedSocket() agentSocket: AuthUserSocket, @MessageBody() customerUuid: string): Promise<void> {
		return await this.agentSessionService.startSessionWithCustomer(agentSocket, customerUuid);
	}

	@SubscribeMessage(AgentRequestEvents.EndSessionWithCustomer)
	public async endSessionWithCustomer(@ConnectedSocket() agentSocket: AuthUserSocket, @MessageBody() customerUuid: string): Promise<void> {
		return await this.agentSessionService.endSessionWithCustomer(agentSocket, customerUuid);
	}

	public afterInit(server: Server): void {
		this.agentQueryService.setServer(server);
		this.agentSessionService.setServer(server);
		this.agentConnectionService.setServer(server);
		this.agentNotificationService.setServer(server);
	}

	public async handleDisconnect(socket: Socket): Promise<void> {
		await this.agentConnectionService.handleOutgoingConnection(socket);
	}
}
