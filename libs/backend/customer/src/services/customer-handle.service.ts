import { Injectable } from "@nestjs/common";
import { CustomerHandlerService } from "@sca-backend/data-access-layer";
import { IHandleCustomerRequest, IHandleCustomerResponse } from "@sca-shared/dto";
import { Request } from "express";

@Injectable()
export class CustomerHandleService {
	public constructor(
		// Dependencies

		private readonly customerHandlerService: CustomerHandlerService,
	) {}

	public async handleCustomer(request: Request, handleCustomerRequest: IHandleCustomerRequest): IHandleCustomerResponse {
		const customerIdentifier = await this.customerHandlerService.findOrCreateCustomerIdentifierByCookieThenIp(request.ip, handleCustomerRequest);

		return { customerToken };
	}
}
