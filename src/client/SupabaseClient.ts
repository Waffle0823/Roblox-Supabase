import QueryBuilder from "../query/QueryBuilder";
import { SupabaseClientOptions } from "./types/client";
import { DatabaseWithoutInternals, GenericSchema, Headers } from "./types/common";

export default class SupabaseClient<
	Database extends Record<string, unknown>,
	SchemaName extends string & keyof DatabaseWithoutInternals<Database> =
		"public" extends keyof DatabaseWithoutInternals<Database>
			? "public"
			: string & keyof DatabaseWithoutInternals<Database>,
	Schema extends GenericSchema = DatabaseWithoutInternals<Database>[SchemaName],
> {
	private baseUrl: string;
	private anonKey: Secret;
	private headers: Headers;

	constructor(baseUrl: string, anonKey: Secret, options: SupabaseClientOptions<SchemaName>) {
		assert(baseUrl, "baseUrl is required");
		assert(anonKey, "anonKey is required");

		if (baseUrl.sub(-1) !== "/") {
			baseUrl += "/";
		}

		this.baseUrl = baseUrl + "rest/v1/";
		this.anonKey = anonKey;
		this.headers = {
			"Content-Type": "application/json",
			apikey: anonKey,
		};

		const schema = options.db?.schema;
		if (schema !== undefined && schema.size() > 0 && schema !== "public") {
			this.headers.Prefer = "schema=" + schema;
		}
	}

	public from<TableName extends string & keyof Schema["Tables"], Table extends Schema["Tables"][TableName]>(
		relation: TableName,
	) {
		if (relation === undefined || relation === "") {
			error("Invalid relation name: relation cannot be empty");
		}

		return new QueryBuilder<Table>(this.baseUrl + relation + "/", this.headers);
	}
}
