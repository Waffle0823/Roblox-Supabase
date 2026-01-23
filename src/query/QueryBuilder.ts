import { Headers } from "../client/types/common";
import { GenericTable } from "../client/types/common";

export default class QueryBuilder<Table extends GenericTable> {
	constructor(
		private url: string,
		private headers: Headers = {},
		private schema: string,
	) {}
}
