import QueryBuilder from "../query/QueryBuilder";
import SupabaseRequest from "../request/SupabaseRequest";
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
	private rest: SupabaseRequest;
	private options: SupabaseClientOptions<SchemaName>;

	/**
	 * Creates a new Supabase client instance
	 * @param baseUrl The URL of your Supabase project
	 * @param anonKey The anonymous API key for your Supabase project
	 * @param options Optional configuration options
	 */
	constructor(baseUrl: string, anonKey: Secret, options?: SupabaseClientOptions<SchemaName>) {
		assert(baseUrl !== undefined || baseUrl !== "", "baseUrl is required");
		assert(anonKey, "anonKey is required");

		if (baseUrl.sub(-1) !== "/") {
			baseUrl += "/";
		}

		this.rest = new SupabaseRequest(baseUrl + "rest/v1/", anonKey);
		this.options = options ?? {};
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

		return new QueryBuilder<Table>(this.rest, this.options.global?.headers, relation, this.options.db?.schema);
	}
}
