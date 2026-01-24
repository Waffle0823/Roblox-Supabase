import { GenericTable } from "../../client/types/common";

export type Returning = "minimal" | "representation";
export type Count = "exact" | "planned" | "estimated";
export type Columns<Table extends GenericTable> = keyof Table["Row"] | (keyof Table["Row"])[] | "*";
