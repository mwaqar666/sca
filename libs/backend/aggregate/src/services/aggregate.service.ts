import { Injectable } from "@nestjs/common";
import type { TInjectable, TResolvedInjectables } from "../types";

@Injectable()
export class AggregateService<TServices extends TInjectable> {
	public constructor(public readonly services: TResolvedInjectables<TServices>) {}
}
