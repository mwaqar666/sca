import { ConnectedSocket, MessageBody, type OnGatewayDisconnect, type OnGatewayInit, SubscribeMessage, WebSocketGateway } from "@nestjs/websockets";
import { CustomerSocketConfig, CustomerSocketPort } from "../config";
import type { Server, Socket } from "socket.io";
import { UseGuards } from "@nestjs/common";
import { AuthCustomerSocket, CustomerTokenSocketGuard } from "@sca-backend/auth";
import { HandleIncomingCustomerEvent, HandleIncomingCustomerPayloadDto } from "@sca-shared/dto";
import { CustomerSocketService } from "../services/socket";

@UseGuards(CustomerTokenSocketGuard)
@WebSocketGateway(CustomerSocketPort, CustomerSocketConfig)
export class CustomerGateway implements OnGatewayInit<Server>, OnGatewayDisconnect<Socket> {
	public constructor(
		// Dependencies

		private readonly customerSocketService: CustomerSocketService,
	) {}

	@SubscribeMessage(HandleIncomingCustomerEvent)
	public async handleIncomingCustomer(@ConnectedSocket() customerSocket: AuthCustomerSocket, @MessageBody() handleIncomingCustomerPayloadDto: HandleIncomingCustomerPayloadDto): Promise<void> {
		return await this.customerSocketService.connectIncomingCustomer(customerSocket, handleIncomingCustomerPayloadDto);
	}

	public afterInit(server: Server) {
		this.customerSocketService.setServer(server);
	}

	public handleDisconnect(socket: Socket): void {
		console.log(socket);
	}
}
