import { Injectable } from "@angular/core";
import type { Subscription } from "rxjs";

@Injectable()
export class ComponentGenericService {
	private subscriptions: Array<Subscription> = [];

	public registerSubscriptions(...subscriptions: Array<Subscription>) {
		this.subscriptions.push(...subscriptions);
	}

	public clearSubscriptions(): void {
		this.subscriptions.forEach((subscription: Subscription) => subscription.unsubscribe());
	}
}
