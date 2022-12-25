import { Injectable } from "@nestjs/common";
import type { ICustomerIpInfo } from "@sca-backend/data-access-layer";
import type { IpApiResponse } from "../types";

@Injectable()
export class CustomerInfoService {
	public async gatherCustomerDataFromIp(requestIp: string): Promise<ICustomerIpInfo> {
		const ipApiResponse = await this.makeRequestToIpApi(requestIp);

		if (ipApiResponse.status === "fail") await this.sendApiFailureNotificationToMaintainer();

		return this.extractIpDataFromResponse(requestIp, ipApiResponse);
	}

	private async sendApiFailureNotificationToMaintainer(): Promise<void> {
		// Send Api failure notification from here
	}

	private extractIpDataFromResponse(requestIp: string, ipApiResponse: IpApiResponse): ICustomerIpInfo {
		return {
			customerIp: requestIp,
			customerIsp: ipApiResponse.isp ?? null,
			customerCurrency: ipApiResponse.currency ?? null,
			customerTimezone: ipApiResponse.timezone ?? null,
			customerLongitude: ipApiResponse.lon ?? null,
			customerLatitude: ipApiResponse.lat ?? null,
			customerZip: ipApiResponse.zip ?? null,
			customerDistrict: ipApiResponse.district ?? null,
			customerCity: ipApiResponse.city ?? null,
			customerRegion: ipApiResponse.regionName ?? null,
			customerRegionCode: ipApiResponse.region ?? null,
			customerCountry: ipApiResponse.country ?? null,
			customerCountryCode: ipApiResponse.countryCode ?? null,
			customerContinent: ipApiResponse.continent ?? null,
			customerContinentCode: ipApiResponse.continentCode ?? null,
		};
	}

	private async makeRequestToIpApi(requestIp: string): Promise<IpApiResponse> {
		const ipApiRequestUrl = this.prepareIpApiUrl(requestIp);

		const createdRequest = await fetch(ipApiRequestUrl);

		return <IpApiResponse>await createdRequest.json();
	}

	private prepareIpApiUrl(requestIp: string): string {
		return `http://ip-api.com/json/${requestIp}?fields=status,message,continent,continentCode,country,countryCode,region,regionName,city,district,zip,lat,lon,timezone,currency,isp,query`;
	}
}
