import type { CustomerEntity, UserEntity } from "@sca-backend/data-access-layer";
import type { Request } from "express";
import { Socket } from "socket.io";
import type { DefaultEventsMap } from "socket.io/dist/typed-events";
import type { AuthCustomer, AuthUser } from "../const";

export interface IAuthUserRequest extends Request {
	[AuthUser]: UserEntity;
}

export interface IAuthCustomerRequest extends Request {
	[AuthCustomer]: CustomerEntity;
}

export interface IAuthUserSocketData {
	[AuthUser]: UserEntity;
}

export interface IAuthCustomerSocketData {
	[AuthCustomer]: CustomerEntity;
}

export class IAuthUserSocket extends Socket<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, IAuthUserSocketData> {}

export class IAuthCustomerSocket extends Socket<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, IAuthCustomerSocketData> {}