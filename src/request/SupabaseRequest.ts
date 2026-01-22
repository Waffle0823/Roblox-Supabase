import { HttpService } from "@rbxts/services";
import { SupabaseResponse } from "./Types";

export default class SupabaseRequest {
	private baseUrl: string;
	private anonKey: Secret;

	constructor(baseUrl: string, anonKey: Secret) {
		assert(baseUrl, "baseUrl is required");
		assert(anonKey, "anonKey is required");

		if (baseUrl.sub(-1) !== "/") {
			baseUrl += "/";
		}

		this.baseUrl = baseUrl;
		this.anonKey = anonKey;
	}

	public async request<T = unknown>(params: {
		method: "GET" | "HEAD" | "POST" | "PUT" | "DELETE" | "PATCH";
		path: string;
		body?: unknown;
		headers?: Record<string, string>;
	}): Promise<SupabaseResponse<T>> {
		const response = HttpService.RequestAsync({
			Url: this.baseUrl + params.path,
			Method: params.method,
			Headers: {
				"Content-Type": "application/json",
				apikey: this.anonKey,
				...params.headers,
			},
			Body: params.body !== undefined ? HttpService.JSONEncode(params.body) : undefined,
		});

		return {
			success: response.Success,
			status: response.StatusCode,
			statusMessage: response.StatusMessage,
			body:
				response.Body !== undefined || response.Body !== ""
					? (HttpService.JSONDecode(response.Body) as T)
					: (undefined as T),
			headers: response.Headers,
		};
	}
}
