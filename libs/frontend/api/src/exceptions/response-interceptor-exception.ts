import type { InterceptionException } from "../interfaces";
import { BaseInterceptorException } from "./base-interceptor-exception";

export class ResponseInterceptorException extends BaseInterceptorException {
	constructor(responseError: InterceptionException) {
		super(responseError);
	}
}
