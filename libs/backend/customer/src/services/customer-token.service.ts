import { Injectable } from "@nestjs/common";
import type { CustomerEntity } from "@sca-backend/data-access-layer";
import { TokenService } from "@sca-backend/security";
import type { ICustomerTokenPayload } from "@sca-shared/dto";

@Injectable()
export class CustomerTokenService {
	public constructor(
		// Dependencies

		private readonly tokenService: TokenService,
	) {}

	public async prepareCustomerToken(customerWithProject: CustomerEntity): Promise<string> {
		const customerTokenPayload: Omit<ICustomerTokenPayload, "tokenIdentity"> = {
			projectUuid: customerWithProject.customerCurrentProject.projectCustomerProject.projectUuid,
			customerUuid: customerWithProject.customerUuid,
		};

		return await this.tokenService.createCustomerToken(customerTokenPayload);
	}
}
