import { IException } from "@sca-shared/dto";

export class AppExceptionDto<TException = unknown> implements IException<TException> {
	public error: string;
	public message: TException;
	public statusCode: number;
}
