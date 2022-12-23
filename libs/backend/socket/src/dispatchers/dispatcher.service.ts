import { Injectable } from "@nestjs/common";
import type { Nullable } from "@sca-shared/utils";
import type { Server } from "socket.io";
import type { Room } from "socket.io-adapter";

@Injectable()
export class DispatcherService {
	private server: Nullable<Server> = null;
	private clients: Array<Room> = [];
	private data: Nullable<unknown> = null;

	public usingServer(server: Server): DispatcherService {
		this.server = server;

		return this;
	}

	public toClients(...clients: Room[]): DispatcherService {
		this.clients = clients;

		return this;
	}

	public withData<T>(data: T): DispatcherService {
		this.data = data;

		return this;
	}

	public dispatchMessage(message: string): void {
		const usingServer = this.ensureServerPresence();
		const [clientsArePresent, clients] = this.ensureClientsPresence();

		if (!clientsArePresent) {
			this.runStateCleanUp();

			return;
		}

		usingServer.to(clients).emit(message, this.data);
		this.runStateCleanUp();
	}

	private runStateCleanUp(): void {
		this.server = null;
		this.clients = [];
		this.data = null;
	}

	private ensureServerPresence(): Server {
		if (!this.server) throw new Error("Server is not set before dispatching message!");

		return this.server;
	}

	private ensureClientsPresence(): [boolean, Array<Room>] {
		return [this.clients.length > 0, this.clients];
	}
}
