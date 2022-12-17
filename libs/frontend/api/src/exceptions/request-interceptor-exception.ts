import type { InterceptionException } from "../interfaces";
import { BaseInterceptorException } from "./base-interceptor-exception";

export class RequestInterceptorException extends BaseInterceptorException {
	constructor(requestError: InterceptionException) {
		super(requestError);
	}
}
