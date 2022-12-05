import { TInjectable, TResolvedInjectable } from "~/control-flow";
import { Injectable } from "@nestjs/common";

@Injectable()
export class ControlService<T extends TInjectable> {
	public constructor(public readonly services: TResolvedInjectable<T>) {}
}
