import { GatewayMetadata } from "@nestjs/websockets";
import { ConfigDefaultsConst, SOCKET_CUSTOMER_PATH, SOCKET_CUSTOMER_PORT } from "@sca-backend/config";

export const CustomerSocketPort = ConfigDefaultsConst.Socket[SOCKET_CUSTOMER_PORT];

export const CustomerSocketConfig: GatewayMetadata = {
	cors: { origin: "http://customer.test", credentials: true, allowedHeaders: ["Authorization"] },
	transports: ["websocket"],
	path: ConfigDefaultsConst.Socket[SOCKET_CUSTOMER_PATH],
};
