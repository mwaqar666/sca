import { Injectable } from "@nestjs/common";
import { TResolvedInjectable } from "../types";

@Injectable()
export class AggregateService<TServices extends TResolvedInjectable> {
	public constructor(public readonly services: TServices) {}
}
