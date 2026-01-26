import { Headers, GenericTable } from "../client/types/common";
import FilterBuilder from "../filter/FilterBuilder";
import SupabaseRequest from "../request/SupabaseRequest";
import { SupabaseResponse } from "../request/types/client";
import { addParam, addPrefer, setAcceptProfile, setContentProfile } from "./Utils";
import { Columns, Count, Missing, Resolution, Returning } from "./types/common";

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
		this.baseUrl += this.relation;
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
		{
			count = "estimated",
			head = false,
		}: {
			count?: Count;
			head?: boolean;
		} = {},
	) {
		addPrefer(this.headers, "count", count);
		addPrefer(this.headers, "head", tostring(head));

		setAcceptProfile(this.headers, this.schema);

		let path: string = "";
		if (columns !== undefined) {
			const selectColumns = typeIs(columns, "table")
				? (columns as (keyof Table["Row"])[]).join(",")
				: tostring(columns);
			path = addParam(path, "select", selectColumns);
		}

		return new FilterBuilder(this.baseUrl, this.anonKey, { method: "GET", headers: this.headers, path: path });
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
			missing = "default",
		}: {
			returning?: Returning;
			missing?: Missing;
		} = {},
	): Promise<SupabaseResponse<Table["Row"][]>> {
		setContentProfile(this.headers, this.schema);

		addPrefer(this.headers, "return", returning);
		addPrefer(this.headers, "missing", missing);

		const rest = new SupabaseRequest(this.baseUrl, this.anonKey);

		const response = await rest.request<Table["Row"][]>({
			method: "POST",
			path: "",
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
			returning = "minimal",
			missing = "default",
			resolution = "merge-duplicates",
			onConflict,
		}: {
			returning?: Returning;
			missing?: Missing;
			resolution?: Resolution;
			onConflict?: string;
		} = {},
	): FilterBuilder<Table> {
		setContentProfile(this.headers, this.schema);

		addPrefer(this.headers, "return", returning);
		addPrefer(this.headers, "resolution", resolution);
		addPrefer(this.headers, "missing", missing);

		let path: string = "";
		if (onConflict !== undefined && onConflict !== "") {
			path = addParam(path, "on_conflict", onConflict);
		}

		return new FilterBuilder<Table>(this.baseUrl, this.anonKey, {
			method: "POST",
			headers: this.headers,
			path: path,
			body: data,
		});
	}

	/**
	 * Updates existing records in the table
	 * @param data The data to update
	 * @returns Promise resolving to the updated rows
	 */
	public update(
		data: Table["Update"],
		{
			returning = "minimal",
		}: {
			returning?: Returning;
		} = {},
	): FilterBuilder<Table> {
		setContentProfile(this.headers, this.schema);

		addPrefer(this.headers, "return", returning);

		return new FilterBuilder<Table>(this.baseUrl, this.anonKey, {
			method: "PATCH",
			headers: this.headers,
			body: data,
		});
	}

	/**
	 * Deletes records from the table
	 * @returns Promise resolving to the deleted rows
	 */
	public delete({ returning = "minimal" }: { returning?: Returning } = {}): FilterBuilder<Table> {
		setContentProfile(this.headers, this.schema);

		addPrefer(this.headers, "return", returning);

		return new FilterBuilder<Table>(this.baseUrl, this.anonKey, {
			method: "DELETE",
			headers: this.headers,
		});
	}
}
