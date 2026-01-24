import { Headers, GenericTable } from "../client/types/common";
import FilterBuilder from "../filter/FilterBuilder";
import SupabaseRequest from "../request/SupabaseRequest";
import { SupabaseResponse } from "../request/types/client";
import { addPrefer, setSchema } from "./Utils";
import { Columns, Count, Returning } from "./types/common";

/**
 * Builds and executes database queries against a Supabase table
 * @template Table The table structure type
 */
export default class QueryBuilder<Table extends GenericTable> {
	/**
	 * Creates a new QueryBuilder instance
	 * @param rest The SupabaseRequest instance for making API calls
	 * @param headers Optional headers to include with requests
	 * @param relation The table or view name to query
	 * @param schema Optional schema name
	 */
	constructor(
		private rest: SupabaseRequest,
		private headers: Headers = {},
		private relation: string,
		private schema?: string,
	) {}

	/**
	 * Performs a SELECT query to retrieve data from the table
	 * @param columns The columns to select or "*" for all columns
	 * @param options Additional query options
	 * @param options.head Whether to retrieve only metadata
	 * @param options.count Count options
	 * @returns A FilterBuilder instance for building the query
	 * @unimplemented This method is not yet implemented
	 */
	public select(
		columns?: Columns<Table>,
		options?: {
			head?: boolean;
			count?: Count;
		},
	) {
		if (options?.count) {
			this.headers = addPrefer(this.headers, "count", options.count);
		}

		if (options?.head) {
			this.headers = addPrefer(this.headers, "head", tostring(options.head));
		}

		return new FilterBuilder(this.rest, this.headers, this.relation, this.schema, columns);
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
		assert(data, "Data cannot be empty");

		const path = setSchema(this.relation, this.schema);

		this.headers = addPrefer(this.headers, "return", returning);

		const response = await this.rest.request<Table["Row"][]>({
			method: "POST",
			path,
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
	 * @param options.count Count options
	 * @param options.defaultToNull Whether to default missing values to null
	 * @returns Promise resolving to the upserted rows
	 * @unimplemented This method is not yet implemented
	 */
	public upsert(
		data: Table["Update"],
		{
			onConflict,
			ignoreDuplicates = false,
			count,
			defaultToNull = true,
		}: {
			onConflict?: string;
			ignoreDuplicates?: boolean;
			count?: Count;
			defaultToNull?: boolean;
		} = {},
	) {}

	/**
	 * Updates existing records in the table
	 * @param data The data to update
	 * @param options Update options
	 * @param options.count Count options
	 * @returns Promise resolving to the updated rows
	 * @unimplemented This method is not yet implemented
	 */
	public update(
		data: Table["Update"],
		{
			count,
		}: {
			count?: Count;
		} = {},
	) {}

	/**
	 * Deletes records from the table
	 * @param options Delete options
	 * @param options.count Count options
	 * @returns Promise resolving to the deleted rows
	 * @unimplemented This method is not yet implemented
	 */
	public delete({
		count,
	}: {
		count?: Count;
	} = {}) {}
}
