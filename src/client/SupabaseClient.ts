import QueryBuilder from "../query/QueryBuilder";
import { SupabaseClientOptions } from "./types/client";
import { DatabaseWithoutInternals, GenericSchema } from "./types/common";

/**
 * Main client for interacting with your Supabase database
 * @template Database The database structure type
 * @template SchemaName The schema name to use, defaults to "public" if available
 * @template Schema The schema structure derived from the database
 */
export default class SupabaseClient<
	Database extends Record<string, unknown>,
	SchemaName extends string & keyof DatabaseWithoutInternals<Database> =
		"public" extends keyof DatabaseWithoutInternals<Database>
			? "public"
			: string & keyof DatabaseWithoutInternals<Database>,
	Schema extends GenericSchema = DatabaseWithoutInternals<Database>[SchemaName],
> {
	/**
	 * Creates a new Supabase client instance
	 * @param baseUrl The URL of your Supabase project
	 * @param anonKey The anonymous API key for your Supabase project
	 * @param options Optional configuration options
	 */
	constructor(
		private baseUrl: string,
		private anonKey: Secret,
		private options: SupabaseClientOptions<SchemaName> = {},
	) {
		assert(this.baseUrl !== "", "baseUrl cannot be empty");
		assert(this.anonKey, "anonKey is required");

		if (this.baseUrl.sub(-1) !== "/") {
			this.baseUrl += "/";
		}

		this.baseUrl += "rest/v1/";
	}

	/**
	 * Creates a query builder for the specified table
	 * @template TableName The name of the table to query
	 * @template Table The structure of the table
	 * @param relation The table name or view to query
	 * @returns A QueryBuilder instance for the specified table
	 */
	public from<TableName extends string & keyof Schema["Tables"], Table extends Schema["Tables"][TableName]>(
		relation: TableName,
	) {
		if (relation === undefined || relation === "") {
			error("Invalid relation name: relation cannot be empty");
		}

		return new QueryBuilder<Table>(
			this.baseUrl,
			this.anonKey,
			this.options.global?.headers,
			relation,
			this.options.db?.schema,
		);
	}
}
