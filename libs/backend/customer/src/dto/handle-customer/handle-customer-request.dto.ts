import type { IHandleCustomerRequest } from "@sca-shared/dto";
import type { Nullable } from "@sca-shared/utils";
import { IsOptional, IsString } from "class-validator";

export class HandleCustomerRequestDto implements IHandleCustomerRequest {
	@IsString()
	@IsOptional()
	public customerCookie: Nullable<string>;
}
