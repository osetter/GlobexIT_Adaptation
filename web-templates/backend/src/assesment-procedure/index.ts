//= require ./modules/devmode.ts
//= require ./modules/req_headers.ts

import { DEV_MODE } from "../assesment-procedure/modules/devmode";
import { log } from "./utils/log";
import { selectAll } from "./utils/query";

/* --- types --- */
interface IRequestBody {
	method?: string;
}
interface ISubdivision {
	id: XmlElem<number>;
	name: XmlElem<string>;
}

/* --- utils --- */
function getParam(name: string, defaultVal: string = "undefined") {
	return tools_web.get_web_param(curParams, name, defaultVal, true, "");
}

function err(source: string, error: unknown, text = "") {
	throw new Error(`${source} -> ${text ? text + " " : ""}${error}`);
}

/* --- global --- */
const curUserId: number = DEV_MODE
	? OptInt("7000000000000000")
	: OptInt(curUserID);
const DEBUG_MODE = tools_web.is_true(getParam("IS_DEBUG", undefined));

/* --- logic --- */
type DepsType = { name: string; id: number; selected: boolean; };
function getDepartments(id: number) {
	try {
		const deps = selectAll<ISubdivision>(`
			SELECT
				[t0].[id],
				[t0].[name]
			FROM [subdivisions] [t0]
			WHERE [t0].[id] = ${id}
		`);

		const result: DepsType[] = [];

		deps.map((item) =>
			result.push({
				name: RValue(item.name),
				id: RValue(item.id),
				selected: false
			})
		);

		return result;
	} catch (e) {
		err("getDepartments", e);
	}
}

function handler(body: object, method: string) {
	const response = {
		success: true,
		error: false,
		data: [] as unknown
	};

	if (method === "getDepartments") {
		const depID = OptInt(body.GetOptProperty("objectId"), 0);
		response.data = getDepartments(depID);
	} else if (method === "getUserId") {
		response.data = curUserId;
	}

	return response;
}

/* --- start point --- */
function main(req: Request, res: Response) {
	try {
		const body: IRequestBody = tools.read_object(req.Body);

		const method = tools_web.convert_xss(
			body.GetOptProperty("method") as string
		);

		if (IsEmptyValue(method) || method === "undefined") {
			err("main", "Не найдено поле method в body" );
		}

		const payload = handler(body, method);

		res.Write(tools.object_to_text(payload, "json"));
	} catch (error) {
		if (DEV_MODE) {
			Response.Write(error);
		} else {
			log(`[uid:${curUserId}] -> ${error}`, "error");
			Request.SetRespStatus(500, "");
			const res = {
				data: [] as [],
				success: false,
				error: true,
				message: "Произошла ошибка на стороне сервера",
				log: logConfig.code
			};
			Response.Write(tools.object_to_text(res, "json"));
		}
	}
}

export const logConfig = {
	code: "globex_web_log",
	type: "web",
	objectId: customWebTemplate.id
};
EnableLog(logConfig.code, DEBUG_MODE);

main(Request, Response);

export {};
