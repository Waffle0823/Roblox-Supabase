import { Headers, GenericTable } from "../client/types/common";
import FilterBuilder from "../filter/FilterBuilder";
import SupabaseRequest from "../request/SupabaseRequest";
import { SupabaseResponse } from "../request/types/client";
import { addParam, addPrefer, setAcceptProfile, setContentProfile } from "./Utils";
import { Columns, Count, Returning } from "./types/common";

/**
 * Builds and executes database queries against a Supabase table
 * @template Table The table structure type
 */
export default class QueryBuilder<Table extends GenericTable> {
	/**
	 * Creates a new QueryBuilder instance
	 * @param baseUrl The base URL for the API requests
	 * @param anonKey The anonymous key for authentication
	 * @param headers Optional headers to include with requests
	 * @param relation The table or view name to query
	 * @param schema Optional schema name
	 */
	constructor(
		private baseUrl: string,
		private anonKey: Secret,
		private headers: Headers = {},
		private relation: string,
		private schema?: string,
	) {
		this.baseUrl += this.relation + "/";
	}

	/**
	 * Performs a SELECT query to retrieve data from the table
	 * @param columns The columns to select or "*" for all columns
	 * @param options Additional query options
	 * @param options.head Whether to retrieve only metadata
	 * @param options.count Count options
	 * @returns A FilterBuilder instance for building the query
	 */
	public select(
		columns?: Columns<Table>,
		options?: {
			head?: boolean;
			count?: Count;
		},
	) {
		if (options?.count) {
			addPrefer(this.headers, "count", options.count);
		}

		if (options?.head) {
			addPrefer(this.headers, "head", tostring(options.head));
		}

		setAcceptProfile(this.headers, this.schema);

		if (columns !== undefined) {
			const selectColumns = typeIs(columns, "table")
				? (columns as (keyof Table["Row"])[]).join(",")
				: tostring(columns);
			this.baseUrl = addParam(this.baseUrl, "select", selectColumns);
		}

		return new FilterBuilder("SELECT", this.baseUrl, this.anonKey, this.headers);
	}

	/**
	 * Inserts new records into the table
	 * @param data The data to insert
	 * @param options Insert options
	 * @param options.returning How data should be returned, defaults to "representation"
	 * @returns Promise resolving to the inserted rows
	 */
	public async insert(
		data: Table["Insert"],
		{
			returning = "representation",
		}: {
			returning?: Returning;
		} = {},
	): Promise<SupabaseResponse<Table["Row"][]>> {
		setContentProfile(this.headers, this.schema);

		addPrefer(this.headers, "return", tostring(returning));

		const rest = new SupabaseRequest(this.baseUrl, this.anonKey);

		const response = await rest.request<Table["Row"][]>({
			method: "POST",
			path: this.baseUrl,
			headers: this.headers,
			body: data,
		});

		return response;
	}

	/**
	 * Inserts or updates records based on a conflict target
	 * @param data The data to upsert
	 * @param options Upsert options
	 * @param options.onConflict Column to check for conflicts
	 * @param options.ignoreDuplicates Whether to ignore duplicate inserts
	 * @returns Promise resolving to the upserted rows
	 */
	public upsert(
		data: Table["Update"],
		{
			onConflict,
			ignoreDuplicates = false,
		}: {
			onConflict?: string;
			ignoreDuplicates?: boolean;
		} = {},
	): FilterBuilder<Table> {
		const resolution = ignoreDuplicates ? "ignore-duplicates" : "merge-duplicates";
		addPrefer(this.headers, "resolution", resolution);

		setContentProfile(this.headers, this.schema);

		if (onConflict !== undefined) {
			this.baseUrl = addParam(this.baseUrl, "on_conflict", tostring(onConflict));
		}

		return new FilterBuilder<Table>("UPSERT", this.baseUrl, this.anonKey, this.headers, data);
	}

	/**
	 * Updates existing records in the table
	 * @param data The data to update
	 * @returns Promise resolving to the updated rows
	 */
	public update(data: Table["Update"]): FilterBuilder<Table> {
		setContentProfile(this.headers, this.schema);

		return new FilterBuilder<Table>("UPDATE", this.baseUrl, this.anonKey, this.headers, data);
	}

	/**
	 * Deletes records from the table
	 * @returns Promise resolving to the deleted rows
	 */
	public delete(): FilterBuilder<Table> {
		setContentProfile(this.headers, this.schema);

		return new FilterBuilder<Table>("DELETE", this.baseUrl, this.anonKey, this.headers);
	}
}
