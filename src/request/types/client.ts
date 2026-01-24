/**
 * Response object returned from Supabase API requests
 * @template T The type of data returned by the API
 */
export interface SupabaseResponse<T = unknown> {
	/** Whether the request was successful */
	success: boolean;
	/** HTTP status code returned by the API */
	status: number;
	/** Status message or error message from the API */
	statusMessage: string;
	/** Response data returned by the API */
	data: T;
	/** HTTP headers from the response */
	headers: Record<string, string>;
}
