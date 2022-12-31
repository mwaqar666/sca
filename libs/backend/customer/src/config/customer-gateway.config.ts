import { ConfigDefaultsConst, SOCKET_CUSTOMER_PATH, SOCKET_CUSTOMER_PORT } from "@sca-backend/config";
import type { GatewayMetadata } from "@nestjs/websockets";

export const CustomerSocketPort = ConfigDefaultsConst.Socket[SOCKET_CUSTOMER_PORT];

export const CustomerSocketConfig: GatewayMetadata = {
	cors: { origin: "*", credentials: true, allowedHeaders: ["Authorization"] },
	transports: ["websocket"],
	path: ConfigDefaultsConst.Socket[SOCKET_CUSTOMER_PATH],
};
