import { RequestInterceptorException } from "../../exceptions";
import type { ApiRequest, GlobalApiRequestInterceptor } from "../../interfaces";

export class RemoveEmptyStringsAndUndefinedValues implements GlobalApiRequestInterceptor {
	public async intercept(apiRequest: ApiRequest<any>): Promise<ApiRequest<any>> {
		function setUndefinedAndEmptyStringsAsNull(data: any) {
			for (const [dataKey, dataValue] of Object.entries(data)) {
				if (dataValue === "" || dataValue === undefined) {
					data[dataKey] = null;
					continue;
				}

				if (Array.isArray(dataValue)) {
					data[dataKey] = traverseArrayForUndefinedAndEmptyStrings(dataValue);
					continue;
				}

				if (typeof dataValue === "object" && dataValue !== null) {
					data[dataKey] = setUndefinedAndEmptyStringsAsNull(dataValue);
				}
			}

			return data;
		}

		function traverseArrayForUndefinedAndEmptyStrings(data: any[]): any {
			return data.map((eachDataPiece: any) => setUndefinedAndEmptyStringsAsNull(eachDataPiece));
		}

		if (apiRequest.data) {
			apiRequest.data = setUndefinedAndEmptyStringsAsNull(apiRequest.data);
		}

		return apiRequest;
	}

	public async handleInterceptionException(error: any): Promise<RequestInterceptorException> {
		throw new RequestInterceptorException({ error: "Request body sanitization interceptor failed!", message: error });
	}
}
