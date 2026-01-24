/** Type for HTTP headers */
export type Headers = Record<string, unknown>;

/**
 * Extracts database schemas excluding internal Supabase properties
 * @template DB The database type
 */
export type DatabaseWithoutInternals<DB extends Record<string, unknown>> = {
	[K in Exclude<keyof DB, "__InternalSupabase">]: DB[K] extends GenericSchema ? DB[K] : never;
};

/**
 * Represents a relationship between database tables
 */
export type GenericRelationship = {
	/** Name of the foreign key constraint */
	foreignKeyName: string;
	/** Column names in the source table */
	columns: string[];
	/** Whether the relationship is one-to-one */
	isOneToOne?: boolean;
	/** Name of the referenced table or view */
	referencedRelation: string;
	/** Column names in the referenced table */
	referencedColumns: string[];
};

/**
 * Generic structure for a database table
 */
export type GenericTable = {
	/** Row data structure returned from queries */
	Row: Record<string, unknown>;
	/** Data structure for insert operations */
	Insert: Record<string, unknown>;
	/** Data structure for update operations */
	Update: Record<string, unknown>;
	/** Table relationships with other tables */
	Relationships: GenericRelationship[];
};

/**
 * Generic structure for an updatable database view
 */
export type GenericUpdatableView = {
	/** Row data structure returned from queries */
	Row: Record<string, unknown>;
	/** Data structure for insert operations */
	Insert: Record<string, unknown>;
	/** Data structure for update operations */
	Update: Record<string, unknown>;
	/** View relationships with tables */
	Relationships: GenericRelationship[];
};

/**
 * Generic structure for a non-updatable database view
 */
export type GenericNonUpdatableView = {
	/** Row data structure returned from queries */
	Row: Record<string, unknown>;
	/** View relationships with tables */
	Relationships: GenericRelationship[];
};

/**
 * Generic structure for any database view (updatable or non-updatable)
 */
export type GenericView = GenericUpdatableView | GenericNonUpdatableView;

/**
 * Options for SETOF returns from database functions
 */
export type GenericSetofOption = {
	/** Whether the function returns a set of values */
	isSetofReturn?: boolean | undefined;
	/** Whether the function returns a one-to-one relationship */
	isOneToOne?: boolean | undefined;
	/** Whether the return value is not nullable */
	isNotNullable?: boolean | undefined;
	/** Target column or property */
	to: string;
	/** Source column or property */
	from: string;
};

/**
 * Generic structure for a database function
 */
export type GenericFunction = {
	/** Function arguments structure */
	Args: Record<string, unknown> | never;
	/** Function return type */
	Returns: unknown;
	/** Configuration for SETOF return values */
	SetofOptions?: GenericSetofOption;
};

/**
 * Generic structure for a database schema
 */
export type GenericSchema = {
	/** Tables in the schema */
	Tables: Record<string, GenericTable>;
	/** Views in the schema */
	Views: Record<string, GenericView>;
	/** Functions in the schema */
	Functions: Record<string, GenericFunction>;
};
