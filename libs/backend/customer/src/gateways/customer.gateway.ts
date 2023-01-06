import { ConnectedSocket, MessageBody, type OnGatewayDisconnect, type OnGatewayInit, SubscribeMessage, WebSocketGateway } from "@nestjs/websockets";
import { CustomerSocketConfig, CustomerSocketPort } from "../config";
import type { Server, Socket } from "socket.io";
import { UseGuards } from "@nestjs/common";
import { AuthCustomerSocket, CustomerTokenSocketGuard } from "@sca-backend/auth";
import { CustomerRequestEvents, type IIncomingCustomerRequestDto, type IIncomingCustomerResponseDto } from "@sca-shared/dto";
import { CustomerConnectionService, CustomerNotificationService } from "../services/socket";

@UseGuards(CustomerTokenSocketGuard)
@WebSocketGateway(CustomerSocketPort, CustomerSocketConfig)
export class CustomerGateway implements OnGatewayInit<Server>, OnGatewayDisconnect<Socket> {
	public constructor(
		// Dependencies

		private readonly customerConnectionService: CustomerConnectionService,
		private readonly customerNotificationService: CustomerNotificationService,
	) {}

	@SubscribeMessage(CustomerRequestEvents.IncomingCustomer)
	public async handleIncomingCustomer(
		@ConnectedSocket() customerSocket: AuthCustomerSocket,
		@MessageBody() incomingCustomerRequestDto: IIncomingCustomerRequestDto,
	): Promise<IIncomingCustomerResponseDto> {
		return await this.customerConnectionService.handleIncomingConnection(customerSocket, incomingCustomerRequestDto);
	}

	public afterInit(server: Server) {
		this.customerConnectionService.setServer(server);
		this.customerNotificationService.setServer(server);
	}

	public async handleDisconnect(socket: Socket): Promise<void> {
		await this.customerConnectionService.handleOutgoingConnection(socket);
	}
}
