import { Injectable } from "@nestjs/common";
import { type TResolvedInjectable } from "../types";

@Injectable()
export class AggregateService<TServices extends TResolvedInjectable> {
	public constructor(public readonly services: TServices) {}
}
