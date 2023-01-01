import type { Server } from "socket.io";

export abstract class SocketService {
	public server: Server;

	public setServer(server: Server): void {
		this.server = server;
	}
}
