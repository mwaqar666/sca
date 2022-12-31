import type { Server } from "socket.io";

export abstract class SocketService {
	public server: Server;

	public abstract setServer(server: Server): void;
}
