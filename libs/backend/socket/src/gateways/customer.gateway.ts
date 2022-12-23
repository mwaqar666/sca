import { type OnGatewayDisconnect, type OnGatewayInit, WebSocketGateway } from "@nestjs/websockets";
import type { Server, Socket } from "socket.io";
import { CustomerSocketConfig, CustomerSocketPort } from "../config";

@WebSocketGateway(CustomerSocketPort, CustomerSocketConfig)
export class CustomerGateway implements OnGatewayInit<Server>, OnGatewayDisconnect<Socket> {
	public afterInit(server: Server): void {
		console.log(server);
	}

	public handleDisconnect(client: Socket): void {
		console.log(client);
	}
}
