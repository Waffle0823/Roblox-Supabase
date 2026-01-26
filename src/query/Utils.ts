import { Headers } from "../client/types/common";

export function addParam(path: string, param: string, value: string) {
	return path + (string.find(path, "?").size() === 0 ? "?" : "&") + param + "=" + value;
}

export function addPrefer(headers: Headers, key: string, value: string) {
	if (headers["Prefer"] !== undefined && headers["Prefer"] !== "") {
		headers["Prefer"] += `, ${key}=${value}`;
	} else {
		headers["Prefer"] = `${key}=${value}`;
	}
}

export function setAcceptProfile(headers: Headers, schema?: string) {
	if (schema === undefined || schema === "" || schema === "public") return;

	headers["Accept-Profile"] = schema;
}

export function setContentProfile(headers: Headers, schema?: string) {
	if (schema === undefined || schema === "" || schema === "public") return;

	headers["Content-Profile"] = schema;
}
