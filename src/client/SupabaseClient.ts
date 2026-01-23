import SupabaseRequest from "../request/SupabaseRequest";
import { GenericSchema, ClientServerOptions } from "./types/common";

export default class SupabaseClient<
	Database extends Record<string, GenericSchema>,
	ClientOptions extends ClientServerOptions = Database extends {
		__InternalSupabase: infer I extends ClientServerOptions;
	}
		? I
		: object,
	SchemaName extends string & keyof Omit<Database, "__InternalSupabase"> = "public" extends keyof Omit<
		Database,
		"__InternalSupabase"
	>
		? "public"
		: string & keyof Omit<Database, "__InternalSupabase">,
	Schema extends GenericSchema = Omit<Database, "__InternalSupabase">[SchemaName],
> {
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
