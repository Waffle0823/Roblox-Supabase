import { Headers, GenericTable } from "../client/types/common";
import SupabaseRequest from "../request/SupabaseRequest";
import { Count } from "./types/common";

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

	public insert(
		data: Table["Insert"],
		{
			count,
			defaultToNull = true,
		}: {
			count?: Count;
			defaultToNull?: boolean;
		} = {},
	) {}

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
