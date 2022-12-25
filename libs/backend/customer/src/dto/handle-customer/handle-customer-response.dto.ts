import type { IHandleCustomerResponse } from "@sca-shared/dto";

export class HandleCustomerResponseDto implements IHandleCustomerResponse {
	public customerToken: string;
	public customerCookie: string;
}
