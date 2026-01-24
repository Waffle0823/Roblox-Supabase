import { GenericTable, Headers } from "../client/types/common";
import SupabaseRequest from "../request/SupabaseRequest";
import { Columns } from "../query/types/common";

export default class FilterBuilder<Table extends GenericTable> {
	constructor(
		private rest: SupabaseRequest,
		private headers: Headers = {},
		private relation: string,
		private schema?: string,
		private columns?: Columns<Table>,
	) {}
}
