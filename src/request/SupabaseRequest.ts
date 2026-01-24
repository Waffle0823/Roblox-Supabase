import { HttpService } from "@rbxts/services";
import { SupabaseResponse } from "./types/client";
import { Headers } from "../client/types/common";

export default class SupabaseRequest {
	constructor(
		private baseUrl: string,
		private anonKey: Secret,
	) {}

	public async request<T = unknown>(params: {
		method: "GET" | "HEAD" | "POST" | "PUT" | "DELETE" | "PATCH";
		path: string;
		body?: unknown;
		headers?: Headers;
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

		const parsedBody =
			response.Body !== undefined && response.Body !== "" ? HttpService.JSONDecode(response.Body) : undefined;

		let statusMessage: string;
		if (response.StatusMessage !== undefined && response.StatusMessage !== "") {
			statusMessage = response.StatusMessage;
		} else if (
			(parsedBody as Record<string, string>).message !== undefined &&
			(parsedBody as Record<string, string>).message !== ""
		) {
			statusMessage = (parsedBody as Record<string, string>).message;
		} else {
			statusMessage = "";
		}

		return {
			success: response.Success,
			status: response.StatusCode,
			statusMessage: statusMessage,
			data: parsedBody as T,
			headers: response.Headers,
		};
	}
}
