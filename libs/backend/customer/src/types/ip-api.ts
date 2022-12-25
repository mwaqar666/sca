import type { ExclusiveUnion, Nullable } from "@sca-shared/utils";

export interface IpApiBaseResponse {
	query: string;
}

export interface IpApiSuccessfulResponse extends IpApiBaseResponse {
	status: "success";
	continent: Nullable<string>;
	continentCode: Nullable<string>;
	country: Nullable<string>;
	countryCode: Nullable<string>;
	region: Nullable<string>;
	regionName: Nullable<string>;
	city: Nullable<string>;
	district: Nullable<string>;
	zip: Nullable<string>;
	lat: Nullable<number>;
	lon: Nullable<number>;
	timezone: Nullable<string>;
	currency: Nullable<string>;
	isp: Nullable<string>;
}

export interface IpApiUnSuccessfulResponse extends IpApiBaseResponse {
	status: "fail";
}

export type IpApiResponse = ExclusiveUnion<[IpApiSuccessfulResponse, IpApiUnSuccessfulResponse]>;
