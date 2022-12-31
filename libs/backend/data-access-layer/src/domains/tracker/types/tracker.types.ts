import type { Nullable } from "@sca-shared/utils";

export type ICustomerSource = "website";

export interface ICustomerTrackingInfo {
	arrivalTime: string;
	departureTime: Nullable<string>;
	customerSource: ICustomerSource;
	pageVisits: Record<string, Array<ICustomerPageVisitInfo>>;
}

export interface ICustomerPageVisitInfo {
	pageUrl: string;
	pageArrivalTime: string;
	pageDepartureTime: Nullable<string>;
}
