import type { GatewayMetadata } from "@nestjs/websockets";
import { ConfigDefaultsConst, SOCKET_AGENT_PATH, SOCKET_AGENT_PORT } from "@sca-backend/config";

export const AgentSocketPort = ConfigDefaultsConst.Socket[SOCKET_AGENT_PORT];

export const AgentSocketConfig: GatewayMetadata = {
	cors: { origin: "http://agent.test", credentials: true, allowedHeaders: ["Authorization"] },
	transports: ["websocket"],
	path: ConfigDefaultsConst.Socket[SOCKET_AGENT_PATH],
};
