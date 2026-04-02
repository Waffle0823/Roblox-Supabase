/**
 * Response object returned from Supabase API requests
 * @template T The type of data returned by the API
 */
export type SupabaseResponse<T = unknown> = SupabaseSuccessResponse<T> | SupabaseFailResponse;

/**
 * Error class representing errors returned from PostgREST/Supabase API
 * Contains detailed information about what went wrong with a database operation
 */
export interface PostgrestError {
	/** Human-readable error message */
	message: string;
	/** Additional details about the error */
	details: string;
	/** Hint for resolving the error, if available */
	hint: string;
	/** PostgreSQL error code */
	code: string;
}

/**
 * Base interface for all Supabase API responses
 * Contains common properties shared by success and error responses
 */
export interface SupabaseResponseBase {
	/** HTTP status code returned by the API */
	status: number;
	/** HTTP status text describing the response status */
	statusText: string;
}

/**
 * Represents a successful response from the Supabase API
 * @template T The type of data returned by the API
 */
export interface SupabaseSuccessResponse<T> extends SupabaseResponseBase {
	/** Undefined when the request was successful */
	err: undefined;
	/** The data returned by the API */
	data: T;
	/** The count of records affected or returned, if requested */
	count: number | undefined;
}

/**
 * Represents a failed response from the Supabase API
 * Contains error information about what went wrong
 */
export interface SupabaseFailResponse extends SupabaseResponseBase {
	/** The error object containing details about the failure */
	err: PostgrestError;
	/** Undefined when the request failed */
	data: undefined;
	/** Undefined when the request failed */
	count: undefined;
}
