export interface IExceptionHandler<T> {
	operation: ExceptionHandlerCallback<T>;
	exceptionHandler?: ExceptionHandlerError;
}

export type ExceptionHandlerCallback<T> = () => Promise<T>;

export type ExceptionHandlerError = (error: any) => Promise<void>;
