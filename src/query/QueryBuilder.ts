import { Headers, GenericTable } from "../client/types/common";
import { Count } from "./types/common";

export default class QueryBuilder<Table extends GenericTable> {
	constructor(
		private url: string,
		private headers: Headers = {},
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
