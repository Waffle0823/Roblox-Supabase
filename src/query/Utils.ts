import { Headers } from "../client/types/common";

export function setSchema(relation: string, schema?: string) {
	if (schema === "public" || schema === undefined || schema === "") return relation;
	return `${schema}.${relation}`;
}

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
