import { Injectable } from "@nestjs/common";
import { CustomerProjectIdentityService } from "@sca-backend/data-access-layer";
import type { IHandleCustomerRequest, IHandleCustomerResponse } from "@sca-shared/dto";
import type { Request } from "express";
import { CustomerInfoService } from "./customer-info.service";
import { CustomerTokenService } from "./customer-token.service";

@Injectable()
export class CustomerHandleService {
	public constructor(
		// Dependencies

		private readonly customerTokenService: CustomerTokenService,
		private readonly customerInfoService: CustomerInfoService,
		private readonly customerHandlerService: CustomerProjectIdentityService,
	) {}

	public async handleCustomer(request: Request, handleCustomerRequest: IHandleCustomerRequest): Promise<IHandleCustomerResponse> {
		const customerIpInfo = await this.customerInfoService.gatherCustomerDataFromIp(request.ip);

		const customerWithProject = await this.customerHandlerService.findOrCreateAndAssociateCustomerWithProject(customerIpInfo, handleCustomerRequest);

		const customerToken = await this.customerTokenService.prepareCustomerToken(customerWithProject);

		return { customerToken, customerCookie: customerWithProject.customerCookie };
	}
}
