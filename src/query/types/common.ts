import { GenericTable } from "../../client/types/common";

export type Columns<Table extends GenericTable> = keyof Table["Row"] | (keyof Table["Row"])[] | "*";

export type Returning = "minimal" | "representation";
export type Count = "exact" | "planned" | "estimated";
export type Missing = "default" | "ignore";
export type Resolution = "ignore-duplicates" | "merge-duplicates";
