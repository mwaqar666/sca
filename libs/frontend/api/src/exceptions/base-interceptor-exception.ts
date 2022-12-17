import type { InterceptionException } from "../interfaces";

export class BaseInterceptorException extends Error {
	constructor(protected error: InterceptionException) {
		super(error.error);
	}

	public getErrorMessage() {
		return this.error.error;
	}

	public getErrorDescription<T = unknown>(): T {
		return this.error.message as T;
	}
}
