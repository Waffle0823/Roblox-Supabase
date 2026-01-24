import { Headers, GenericTable } from "../client/types/common";
import SupabaseRequest from "../request/SupabaseRequest";
import { SupabaseResponse } from "../request/types/client";
import { setSchema } from "./Utils";
import { Count, Returning } from "./types/common";

export default class QueryBuilder<Table extends GenericTable> {
	constructor(
		private rest: SupabaseRequest,
		private headers: Headers = {},
		private relation: string,
		private schema?: string,
	) {}

	public select(
		columns?: keyof Table["Row"] | "*",
		options?: {
			head?: boolean;
			count?: Count;
		},
	) {}

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

		this.headers["Prefer"] = `return=${returning}`;

		const response = await this.rest.request<Table["Row"][]>({
			method: "POST",
			path,
			headers: this.headers,
			body: data,
		});

		return response;
	}

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

	public update(
		data: Table["Update"],
		{
			count,
		}: {
			count?: Count;
		} = {},
	) {}

	public delete({
		count,
	}: {
		count?: Count;
	} = {}) {}
}
