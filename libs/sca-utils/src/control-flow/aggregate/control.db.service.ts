import { Injectable } from "@nestjs/common";
import { TInjectable, TResolvedInjectable } from "../types";

@Injectable()
export class ControlDbService<T extends TInjectable> {
	public constructor(public readonly services: TResolvedInjectable<T>) {}
}
