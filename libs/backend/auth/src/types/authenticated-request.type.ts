import { Request } from "express";
import { AuthenticatedUserEntity } from "../const";

export interface AuthenticatedRequest extends Request {
	[AuthenticatedUserEntity]: never;
}
