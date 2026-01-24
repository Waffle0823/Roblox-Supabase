import { HttpService } from "@rbxts/services";
import { SupabaseResponse } from "./types/client";
import { Headers } from "../client/types/common";

/**
 * Handles HTTP requests to a Supabase backend
 * @class SupabaseRequest
 */
export default class SupabaseRequest {
	/**
	 * Creates a new SupabaseRequest instance
	 * @param baseUrl The base URL of the Supabase API endpoint
	 * @param anonKey The anonymous API key for authentication
	 */
	constructor(
		private baseUrl: string,
		private anonKey: Secret,
	) {}

	/**
	 * Sends an HTTP request to the Supabase API
	 * @template T The expected response data type
	 * @param params Request configuration parameters
	 * @param params.method HTTP method to use (GET, POST, etc.)
	 * @param params.path API endpoint path to append to the base URL
	 * @param params.body Optional request body to send
	 * @param params.headers Optional additional HTTP headers
	 * @returns Promise resolving to a typed Supabase response
	 */
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
