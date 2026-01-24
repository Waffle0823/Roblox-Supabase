/**
 * Configuration options for the Supabase client
 * @template SchemaName The schema name type
 */
export type SupabaseClientOptions<SchemaName> = {
	/** Database configuration options */
	db?: {
		/** Schema to use for database operations */
		schema?: SchemaName;
	};

	/** Authentication configuration options */
	auth?: {
		/** Whether to throw errors during authentication operations */
		throwOnError?: boolean;
	};

	/** Global configuration options */
	global?: {
		/** Headers to include with all requests */
		headers?: Record<string, string>;
	};
};
