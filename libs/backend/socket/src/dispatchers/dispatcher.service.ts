import { Injectable } from "@nestjs/common";
import type { Server } from "socket.io";
import type { Room } from "socket.io-adapter";
import { EntityKeyColumnStripperInterceptor } from "@sca-backend/db";

@Injectable()
export class DispatcherService {
	public constructor(
		// Dependencies

		private readonly entityKeyColumnStripperInterceptor: EntityKeyColumnStripperInterceptor,
	) {}

	public dispatchMessage(message: string, fromServer: Server, toClients: Room[]): void;
	public dispatchMessage<T>(message: string, fromServer: Server, toClients: Room[], withData: T): void;
	public dispatchMessage<T>(message: string, fromServer: Server, toClients: Room[], withData?: T): void {
		const [clientsArePresent, clients] = this.ensureClientsPresence(toClients);

		if (!clientsArePresent) return;

		const emissionData: Array<T> = [];

		if (withData) {
			withData = this.entityKeyColumnStripperInterceptor.filterPrimaryKeysFromResponse(withData);
			emissionData.push(withData);
		}

		fromServer.to(clients).emit(message, ...emissionData);
	}

	private ensureClientsPresence(toClients: Room[]): [boolean, Array<Room>] {
		return [toClients.length > 0, toClients];
	}
}
