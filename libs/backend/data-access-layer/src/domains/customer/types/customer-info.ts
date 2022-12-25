import type { Nullable } from "@sca-shared/utils";

export interface ICustomerPersonalInfo {
	customerName: string;
	customerContact: string;
	customerEmail: string;
}

export interface ICustomerIpInfo {
	customerIp: string;
	customerIsp: Nullable<string>;
	customerCurrency: Nullable<string>;
	customerTimezone: Nullable<string>;
	customerLongitude: Nullable<number>;
	customerLatitude: Nullable<number>;
	customerZip: Nullable<string>;
	customerDistrict: Nullable<string>;
	customerCity: Nullable<string>;
	customerRegion: Nullable<string>;
	customerRegionCode: Nullable<string>;
	customerCountry: Nullable<string>;
	customerCountryCode: Nullable<string>;
	customerContinent: Nullable<string>;
	customerContinentCode: Nullable<string>;
}
