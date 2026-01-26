import { GenericTable, Headers } from "../client/types/common";
import SupabaseRequest from "../request/SupabaseRequest";
import { addParam } from "../query/Utils";
import { HttpService } from "@rbxts/services";
import { isArray } from "./Utils";
import { FilterOperator, SqlOperation } from "./types/common";
import { SupabaseResponse } from "../request/types/client";
import { HttpMethod } from "../request/types/common";

const PostgrestReservedCharsRegexp = "[,()]";

export default class FilterBuilder<Table extends GenericTable> {
	private rest: SupabaseRequest;
	private path: string = "";

	constructor(
		private sqlOperation: SqlOperation,
		private baseUrl: string,
		private anonKey: Secret,
		private headers: Headers = {},
		private body?: unknown,
	) {
		this.rest = new SupabaseRequest(this.baseUrl, this.anonKey);
	}

	public eq<ColumnName extends string & keyof Table["Row"]>(
		column: ColumnName,
		value: Table["Row"][ColumnName],
	): this {
		this.path = addParam(this.path, column, `eq.${tostring(value)}`);

		return this;
	}

	public neq<ColumnName extends string & keyof Table["Row"]>(
		column: ColumnName,
		value: Table["Row"][ColumnName],
	): this {
		this.path = addParam(this.path, column, `neq.${tostring(value)}`);

		return this;
	}

	public gt<ColumnName extends string & keyof Table["Row"]>(
		column: ColumnName,
		value: Table["Row"][ColumnName],
	): this {
		this.path = addParam(this.path, column, `gt.${tostring(value)}`);

		return this;
	}

	public gte<ColumnName extends string & keyof Table["Row"]>(
		column: ColumnName,
		value: Table["Row"][ColumnName],
	): this {
		this.path = addParam(this.path, column, `gte.${tostring(value)}`);

		return this;
	}

	public lt<ColumnName extends string & keyof Table["Row"]>(
		column: ColumnName,
		value: Table["Row"][ColumnName],
	): this {
		this.path = addParam(this.path, column, `lt.${tostring(value)}`);

		return this;
	}

	public lte<ColumnName extends string & keyof Table["Row"]>(
		column: ColumnName,
		value: Table["Row"][ColumnName],
	): this {
		this.path = addParam(this.path, column, `lte.${tostring(value)}`);

		return this;
	}

	public like<ColumnName extends string & keyof Table["Row"]>(column: ColumnName, pattern: string): this {
		this.path = addParam(this.path, column, `like.${pattern}`);

		return this;
	}

	public likeAllOf<ColumnName extends string & keyof Table["Row"]>(column: ColumnName, patterns: string[]): this {
		this.path = addParam(this.path, column, `like(all).{${patterns.join(",")}}`);

		return this;
	}

	public likeAnyOf<ColumnName extends string & keyof Table["Row"]>(column: ColumnName, patterns: string[]): this {
		this.path = addParam(this.path, column, `like(any).{${patterns.join(",")}}`);

		return this;
	}

	public ilike<ColumnName extends string & keyof Table["Row"]>(column: ColumnName, pattern: string): this {
		this.path = addParam(this.path, column, `ilike.${pattern}`);

		return this;
	}

	public ilikeAllOf<ColumnName extends string & keyof Table["Row"]>(column: ColumnName, patterns: string[]): this {
		this.path = addParam(this.path, column, `ilike(all).{${patterns.join(",")}}`);

		return this;
	}

	public ilikeAnyOf<ColumnName extends string & keyof Table["Row"]>(column: ColumnName, patterns: string[]): this {
		this.path = addParam(this.path, column, `ilike(any).{${patterns.join(",")}}`);

		return this;
	}

	public regexMatch<ColumnName extends string & keyof Table["Row"]>(column: ColumnName, pattern: string): this {
		this.path = addParam(this.path, column, `match.${pattern}`);

		return this;
	}

	public regexIMatch<ColumnName extends string & keyof Table["Row"]>(column: ColumnName, pattern: string): this {
		this.path = addParam(this.path, column, `imatch.${pattern}`);

		return this;
	}

	public is<ColumnName extends string & keyof Table["Row"]>(
		column: ColumnName,
		value: Table["Row"][ColumnName] & (boolean | undefined),
	): this {
		this.path = addParam(this.path, column, `is.${tostring(value)}`);

		return this;
	}

	public isDistinct<ColumnName extends string & keyof Table["Row"]>(
		column: ColumnName,
		value: Table["Row"][ColumnName],
	): this {
		this.path = addParam(this.path, column, `is_distinct.${tostring(value)}`);

		return this;
	}

	public in<ColumnName extends string & keyof Table["Row"]>(
		column: ColumnName,
		values: readonly Exclude<Table["Row"][ColumnName], unknown>[],
	): this {
		const cleanedValues = values
			.map((s) => {
				if (typeIs(s, "string") && string.match(s, PostgrestReservedCharsRegexp)[0]) {
					return `"${s}"`;
				}

				return tostring(s);
			})
			.join(",");

		this.path = addParam(this.path, column, `in.(${cleanedValues})`);
		return this;
	}

	public notIn<ColumnName extends string & keyof Table["Row"]>(
		column: ColumnName,
		values: readonly Exclude<Table["Row"][ColumnName], unknown>[],
	): this {
		const cleanedValues = values
			.map((s): string => {
				if (typeIs(s, "string") && string.match(s, PostgrestReservedCharsRegexp)[0]) {
					return `"${s}"`;
				}

				return tostring(s);
			})
			.join(",");

		this.path = addParam(this.path, column, `not.in.(${cleanedValues})`);
		return this;
	}

	public contains<ColumnName extends string & keyof Table["Row"]>(
		column: ColumnName,
		value: string | readonly Exclude<Table["Row"][ColumnName], unknown>[] | Record<string, unknown>,
	): this {
		if (typeIs(value, "string")) {
			this.path = addParam(this.path, column, `cs.${value}`);
		} else if (typeIs(value, "table") && isArray(value)) {
			this.path = addParam(
				this.path,
				column,
				`cs.{${(value as readonly Exclude<Table["Row"][ColumnName], unknown>[]).join(",")}}`,
			);
		} else {
			this.path = addParam(this.path, column, `cs.${HttpService.JSONEncode(value)}`);
		}
		return this;
	}

	public containedBy<ColumnName extends string & keyof Table["Row"]>(
		column: ColumnName,
		value: string | readonly Exclude<Table["Row"][ColumnName], unknown>[] | Record<string, unknown>,
	): this {
		if (typeIs(value, "string")) {
			this.path = addParam(this.path, column, `cd.${value}`);
		} else if (typeIs(value, "table") && isArray(value)) {
			this.path = addParam(
				this.path,
				column,
				`cd.{${(value as readonly Exclude<Table["Row"][ColumnName], unknown>[]).join(",")}}`,
			);
		} else {
			this.path = addParam(this.path, column, `cd.${HttpService.JSONEncode(value)}`);
		}
		return this;
	}

	public rangeGt<ColumnName extends string & keyof Table["Row"]>(column: ColumnName, range: string): this {
		this.path = addParam(this.path, column, `sr.${range}`);
		return this;
	}

	public rangeGte<ColumnName extends string & keyof Table["Row"]>(column: ColumnName, range: string): this {
		this.path = addParam(this.path, column, `nxl.${range}`);
		return this;
	}

	public rangeLt<ColumnName extends string & keyof Table["Row"]>(column: ColumnName, range: string): this {
		this.path = addParam(this.path, column, `sl.${range}`);
		return this;
	}

	public rangeLte<ColumnName extends string & keyof Table["Row"]>(column: ColumnName, range: string): this {
		this.path = addParam(this.path, column, `nxr.${range}`);
		return this;
	}

	public rangeAdjacent<ColumnName extends string & keyof Table["Row"]>(column: ColumnName, range: string): this {
		this.path = addParam(this.path, column, `adj.${range}`);
		return this;
	}

	public overlaps<ColumnName extends string & keyof Table["Row"]>(
		column: ColumnName,
		value: string | readonly Exclude<Table["Row"][ColumnName], unknown>[],
	): this {
		if (typeIs(value, "string")) {
			this.path = addParam(this.path, column, `ov.${value}`);
		} else if (typeIs(value, "table") && isArray(value)) {
			this.path = addParam(this.path, column, `ov.{${value.join(",")}}`);
		}
		return this;
	}

	public textSearch<ColumnName extends string & keyof Table["Row"]>(
		column: ColumnName,
		query: string,
		options: { config?: string; type?: "plain" | "phrase" | "websearch" } = {},
	): this {
		let typePart = "";
		if (options.type === "plain") {
			typePart = "pl";
		} else if (options.type === "phrase") {
			typePart = "ph";
		} else if (options.type === "websearch") {
			typePart = "w";
		}
		const configPart = options.config === undefined ? "" : `(${options.config})`;
		this.path = addParam(this.path, column, `${typePart}fts${configPart}.${query}`);
		return this;
	}

	public match(query: Record<string, unknown>): this {
		for (const [column, value] of pairs(query)) {
			this.path = addParam(this.path, column, `eq.${value}`);
		}
		return this;
	}

	public not<ColumnName extends string & keyof Table["Row"]>(
		column: ColumnName,
		operator: FilterOperator,
		value: Table["Row"][ColumnName],
	): this {
		this.path = addParam(this.path, column, `not.${operator}.${tostring(value)}`);
		return this;
	}

	public or(filters: string, { referencedTable }: { referencedTable?: string } = {}): this {
		const key = referencedTable !== undefined ? `${referencedTable}.or` : "or";
		this.path = addParam(this.path, key, `(${filters})`);
		return this;
	}

	public filter<ColumnName extends string & keyof Table["Row"]>(
		column: ColumnName,
		operator: `${"" | "not."}${FilterOperator}`,
		value: unknown,
	): this {
		this.path = addParam(this.path, column, `${operator}.${tostring(value)}`);
		return this;
	}

	public async execute(): Promise<SupabaseResponse<Table["Row"][]>> {
		let method: HttpMethod | undefined;
		if (this.sqlOperation === "SELECT") method = "GET";
		if (this.sqlOperation === "INSERT") method = "POST";
		if (this.sqlOperation === "UPSERT") method = "POST";
		if (this.sqlOperation === "UPDATE") method = "PATCH";
		if (this.sqlOperation === "DELETE") method = "DELETE";

		if (method === undefined) error("Invalid SQL operation");

		return this.rest.request<Table["Row"][]>({
			method: method,
			path: this.path,
			headers: this.headers,
			body: this.body,
		});
	}

	public async maybeSingle(): Promise<SupabaseResponse<Table["Row"] | undefined>> {
		this.headers["Accept"] = "application/vnd.pgrst.object+json";

		let method: HttpMethod | undefined;
		if (this.sqlOperation === "SELECT") method = "GET";
		if (this.sqlOperation === "INSERT") method = "POST";
		if (this.sqlOperation === "UPSERT") method = "POST";
		if (this.sqlOperation === "UPDATE") method = "PATCH";
		if (this.sqlOperation === "DELETE") method = "DELETE";

		if (method === undefined) error("Invalid SQL operation");

		const response = await this.rest.request<Table["Row"] | undefined>({
			method: method,
			path: this.path,
			headers: this.headers,
			body: this.body,
		});

		return response;
	}

	public async single(): Promise<SupabaseResponse<Table["Row"]>> {
		this.headers["Accept"] = "application/vnd.pgrst.object+json";

		let method: HttpMethod | undefined;
		if (this.sqlOperation === "SELECT") method = "GET";
		if (this.sqlOperation === "INSERT") method = "POST";
		if (this.sqlOperation === "UPSERT") method = "POST";
		if (this.sqlOperation === "UPDATE") method = "PATCH";
		if (this.sqlOperation === "DELETE") method = "DELETE";

		if (method === undefined) error("Invalid SQL operation");

		const response = await this.rest.request<Table["Row"]>({
			method: method,
			path: this.path,
			headers: this.headers,
			body: this.body,
		});

		if (response.data === undefined) {
			error("Expected exactly one row but received zero or multiple rows");
		}

		return response;
	}
}
