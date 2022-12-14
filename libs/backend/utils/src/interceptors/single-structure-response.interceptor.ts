import { type CallHandler, type ExecutionContext, Injectable, type NestInterceptor } from "@nestjs/common";
import { map, Observable } from "rxjs";
import type { AppSuccessfulResponseDto } from "../dto";

@Injectable()
export class SingleStructureResponseInterceptor<T> implements NestInterceptor<T, AppSuccessfulResponseDto<T>> {
	public intercept(context: ExecutionContext, next: CallHandler<T>): Observable<AppSuccessfulResponseDto<T>> {
		return next.handle().pipe(
			map((data: T) => {
				return { data, error: null };
			}),
		);
	}
}
