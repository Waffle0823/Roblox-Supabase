export interface SupabaseResponse<T = unknown> {
	success: boolean;
	status: number;
	statusMessage: string;
	body: T;
	headers: Record<string, string>;
}
