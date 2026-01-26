/**
 * Response object returned from Supabase API requests
 * @template T The type of data returned by the API
 */
export type SupabaseResponse<T = unknown> = SupabaseSuccessResponse<T> | SupabaseFailResponse;

/**
 * Error class representing errors returned from PostgREST/Supabase API
 * Contains detailed information about what went wrong with a database operation
 */
export default class PostgrestError {
	/** The name of the error, always "PostgrestError" */
	name: string;
	/** Human-readable error message */
	message: string;
	/** Additional details about the error */
	details: string;
	/** Hint for resolving the error, if available */
	hint: string;
	/** PostgreSQL error code */
	code: string;

	/**
	 * Creates a new PostgrestError instance
	 * @param context Object containing error details
	 * @param context.message Human-readable error message
	 * @param context.details Additional details about the error
	 * @param context.hint Hint for resolving the error
	 * @param context.code PostgreSQL error code
	 */
	constructor(context: { message: string; details: string; hint: string; code: string }) {
		this.message = context.message;
		this.name = "PostgrestError";
		this.details = context.details;
		this.hint = context.hint;
		this.code = context.code;
	}
}

/**
 * Base interface for all Supabase API responses
 * Contains common properties shared by success and error responses
 */
export interface SupabaseResponseBase {
	/** Whether the API request was successful */
	success: boolean;
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
	error: undefined;
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
	error: PostgrestError;
	/** Undefined when the request failed */
	data: undefined;
	/** Undefined when the request failed */
	count: undefined;
}
