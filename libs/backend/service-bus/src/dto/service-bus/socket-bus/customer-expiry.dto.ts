import type { Nullable } from "@sca-shared/utils";

export class CustomerExpiryDto {
	public customerUuid: string;
	public projectUuid: string;
	public agentUuid: Nullable<string>;
	public trackingNumber: string;
}
