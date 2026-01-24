import QueryBuilder from "../query/QueryBuilder";
import SupabaseRequest from "../request/SupabaseRequest";
import { SupabaseClientOptions } from "./types/client";
import { DatabaseWithoutInternals, GenericSchema } from "./types/common";

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

	constructor(baseUrl: string, anonKey: Secret, options?: SupabaseClientOptions<SchemaName>) {
		assert(baseUrl, "baseUrl is required");
		assert(anonKey, "anonKey is required");

		if (baseUrl.sub(-1) !== "/") {
			baseUrl += "/";
		}

		this.rest = new SupabaseRequest(baseUrl + "rest/v1/", anonKey);
		this.options = options ?? {};
	}

	public from<TableName extends string & keyof Schema["Tables"], Table extends Schema["Tables"][TableName]>(
		relation: TableName,
	) {
		if (relation === undefined || relation === "") {
			error("Invalid relation name: relation cannot be empty");
		}

		return new QueryBuilder<Table>(this.rest, this.options.global?.headers, relation, this.options.db?.schema);
	}
}
