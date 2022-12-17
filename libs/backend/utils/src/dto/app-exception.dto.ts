import { IException } from "@sca-shared/dto";

export class AppExceptionDto implements IException {
	public error: string;
	public message: unknown;
	public statusCode: number;
}
