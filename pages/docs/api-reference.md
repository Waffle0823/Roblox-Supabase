---
sidebar_position: 7
---

# API Reference

This page provides detailed documentation for the classes and methods available in the Roblox-Supabase library.

## SupabaseClient

The main client for interacting with your Supabase database.

### Constructor

```typescript
new SupabaseClient<Database, SchemaName, Schema>(
  baseUrl: string,
  anonKey: Secret,
  options?: SupabaseClientOptions<SchemaName>
)
```

**Type Parameters:**

- `Database`: The database structure type
- `SchemaName`: The schema name (defaults to "public" if available)
- `Schema`: The schema structure derived from the database

**Parameters:**

- `baseUrl`: The URL of your Supabase project
- `anonKey`: The anonymous API key for your Supabase project
- `options`: Optional configuration options

**Example:**

```typescript
const supabase = new SupabaseClient<Database>("https://your-project.supabase.co", "your-anon-key", {
	global: {
		headers: {
			"Custom-Header": "custom-value",
		},
	},
	db: {
		schema: "public",
	},
});
```

### Methods

#### from

```typescript
from<TableName extends string & keyof Schema["Tables"], Table extends Schema["Tables"][TableName]>(
  relation: TableName
): QueryBuilder<Table>
```

Creates a query builder for the specified table.

**Type Parameters:**

- `TableName`: The name of the table to query
- `Table`: The structure of the table

**Parameters:**

- `relation`: The table name or view to query

**Returns:**

- `QueryBuilder<Table>`: A QueryBuilder instance for the specified table

**Example:**

```typescript
const query = supabase.from("users");
```

## QueryBuilder

Builds and executes database queries against a Supabase table.

### Constructor

```typescript
constructor(
  baseUrl: string,
  anonKey: Secret,
  headers: Headers = {},
  relation: string,
  schema?: string
)
```

**Parameters:**

- `baseUrl`: The base URL for API requests
- `anonKey`: The anonymous key for authentication
- `headers`: Optional headers to include with requests
- `relation`: The table or view name to query
- `schema`: Optional schema name

### Methods

#### select

```typescript
select(
  columns?: Columns<Table>,
  options?: {
    count?: Count;
    head?: boolean;
  }
): FilterBuilder<Table>
```

Performs a SELECT query to retrieve data from the table.

**Parameters:**

- `columns`: The columns to select or "\*" for all columns
- `options.count`: Count options (defaults to "estimated")
- `options.head`: Whether to retrieve only metadata (defaults to false)

**Returns:**

- `FilterBuilder`: For building the query further

**Example:**

```typescript
const query = supabase.from("users").select(["id", "username", "email"], { count: "exact" });
```

#### insert

```typescript
insert(
  data: Table["Insert"],
  options?: {
    returning?: Returning;
	missing?: Missing;
  }
): Promise<SupabaseResponse<Table["Row"][]>>
```

Inserts new records into the table.

**Parameters:**

- `data`: The data to insert
- `options.returning`: How data should be returned (defaults to "representation")
- `options.missing`: How to handle missing data (defaults to "default")

**Returns:**

- Promise resolving to the inserted rows

**Example:**

```typescript
const { data, error } = await supabase
	.from("users")
	.insert({
		username: "newuser",
		email: "user@example.com",
	});
```

#### upsert

```typescript
upsert(
  data: Table["Update"],
  options?: {
    returning?: Returning;
	missing?: Missing;
    resolution?: Resolution;
    onConflict?: string;
  }
): FilterBuilder<Table>
```

Inserts or updates records based on a conflict target.

**Parameters:**

- `data`: The data to upsert
- `options.returning`: How data should be returned (defaults to "minimal")
- `options.missing`: How to handle missing data (defaults to "default")
- `options.resolution`: How to handle duplicate data (defaults to "merge-duplicates")
- `options.onConflict`: Column to check for conflicts

**Returns:**

- `FilterBuilder`: For adding conditions and executing

**Example:**

```typescript
const { data, error } = await supabase
	.from("users")
	.upsert(
		{
			id: 123,
			username: "updateduser",
		},
		{ onConflict: "id" },
	)
	.execute();
```

#### update

```typescript
update(
  data: Table["Update"],
  options?: {
    returning?: Returning;
  }
): FilterBuilder<Table>
```

Updates existing records in the table.

**Parameters:**

- `data`: The data to update
- `options.returning`: How data should be returned (defaults to "minimal")

**Returns:**

- `FilterBuilder`: For adding conditions and executing

**Example:**

```typescript
const { data, error } = await supabase.from("users").update({ active: true }).eq("id", 123).execute();
```

#### delete

```typescript
delete(options?: {
    returning?: Returning;
}): FilterBuilder<Table>
```

Deletes records from the table.

**Parameters:**

- `options.returning`: How data should be returned (defaults to "minimal")

**Returns:**

- `FilterBuilder`: For adding conditions and executing

**Example:**

```typescript
const { data, error } = await supabase.from("users").delete().eq("id", 123).execute();
```

## FilterBuilder

Provides filtering methods for refining database queries.

### Common Filter Methods

| Method                         | Description                               |
| ------------------------------ | ----------------------------------------- |
| `eq(column, value)`            | Equal to                                  |
| `neq(column, value)`           | Not equal to                              |
| `gt(column, value)`            | Greater than                              |
| `gte(column, value)`           | Greater than or equal to                  |
| `lt(column, value)`            | Less than                                 |
| `lte(column, value)`           | Less than or equal to                     |
| `like(column, pattern)`        | Case-sensitive pattern matching           |
| `ilike(column, pattern)`       | Case-insensitive pattern matching         |
| `in(column, values)`           | Value is in array                         |
| `notIn(column, values)`        | Value is not in array                     |
| `is(column, value)`            | Exact match for boolean or null/undefined |
| `contains(column, value)`      | JSON/Array contains value                 |
| `containedBy(column, value)`   | JSON/Array is contained by value          |
| `or(filters)`                  | OR condition                              |
| `not(column, operator, value)` | Negation of a filter                      |

### Execution Methods

#### execute

```typescript
execute(): Promise<SupabaseResponse<Table["Row"][]>>
```

Executes the query and returns multiple rows.

**Returns:**

- Promise resolving to rows matching the query

**Example:**

```typescript
const { data, error } = await supabase.from("users").select("*").eq("active", true).execute();
```

#### single

```typescript
single(): Promise<SupabaseResponse<Table["Row"]>>
```

Executes the query and expects exactly one result.

**Returns:**

- Promise resolving to a single row
- Errors if no rows or multiple rows are returned

**Example:**

```typescript
const { data, error } = await supabase.from("users").select("*").eq("id", 123).single();
```

#### maybeSingle

```typescript
maybeSingle(): Promise<SupabaseResponse<Table["Row"] | undefined>>
```

Executes the query and returns at most one result.

**Returns:**

- Promise resolving to a single row or undefined
- Does not error if no rows are returned
- Errors if multiple rows are returned

**Example:**

```typescript
const { data, error } = await supabase.from("users").select("*").eq("email", "user@example.com").maybeSingle();
```

## Response Types

### SupabaseResponse

```typescript
interface SupabaseResponse<T> {
	data: T | undefined;
	error:
		| {
				message: string;
				details: string;
				hint: string;
				code: string;
		  }
		| undefined;
	status: number;
	statusText: string;
}
```

The response object returned by all query methods.

**Properties:**

- `data`: The query result data (if successful)
- `error`: Error information (if the query failed)
- `status`: HTTP status code
- `statusText`: Status description
