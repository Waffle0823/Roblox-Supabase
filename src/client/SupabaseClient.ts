import SupabaseRequest from "../request/SupabaseRequest";

export default class SupabaseClient {
	private baseUrl: string;
	private anonKey: Secret;
	private rest: SupabaseRequest;
	private headers: Record<string, unknown>;

	constructor(baseUrl: string, anonKey: Secret) {
		assert(baseUrl, "baseUrl is required");
		assert(anonKey, "anonKey is required");

		if (baseUrl.sub(-1) !== "/") {
			baseUrl += "/";
		}

		this.baseUrl = baseUrl;
		this.anonKey = anonKey;
		this.rest = new SupabaseRequest(baseUrl + "rest/v1/", anonKey);
		this.headers = {
			"Content-Type": "application/json",
			apikey: anonKey,
		};
	}
}
