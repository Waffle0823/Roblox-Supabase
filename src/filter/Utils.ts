export function isArray(value: unknown): value is unknown[] {
	return typeIs(value, "table") && (value as { [key: number]: unknown })[0] !== undefined;
}
