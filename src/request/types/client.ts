export interface SupabaseResponse<T = unknown> {
	success: boolean;
	status: number;
	statusMessage: string;
	data: T;
	headers: Record<string, string>;
}
