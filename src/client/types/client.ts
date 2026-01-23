export type SupabaseClientOptions<SchemaName> = {
	db?: {
		schema?: SchemaName;
	};

	auth?: {
		throwOnError?: boolean;
	};

	global?: {
		headers?: Record<string, string>;
	};
};
