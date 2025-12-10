export function err(source: string, error: unknown, text = "") {
	throw new Error(`${source} -> ${text ? text + " " : ""}${error}`);
}