import { type Request } from "express";
import { type AuthenticatedUserEntity } from "../const";

export interface AuthenticatedRequest extends Request {
	[AuthenticatedUserEntity]: never;
}
