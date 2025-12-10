//= require ./modules/req_headers.ts

import { DEV_MODE } from "../assesment-procedure/modules/devmode";

import { log } from "./utils/log";
import { selectAll } from "./utils/query";
import { err } from "./utils/error";
import { getParam } from "./utils/param";

import { IRequestBody } from "./types/RequestBody";
import { ISubdivision } from "./types/Subdivision";
import { ICollaborator } from "./types/Collaborator";


/* --- global --- */
const curUserId: number = DEV_MODE ? OptInt("6148914691236517121") : OptInt(curUserID);
const DEBUG_MODE = tools_web.is_true(getParam("IS_DEBUG", undefined));

/* --- logic --- */
function getSubdivisions() {
	try {
		const subdivisions = selectAll<ISubdivision>(`
			SELECT
				t0.id,
				t0.name
			FROM dbo.subdivisions t0
		`);

		return subdivisions;
	} catch (e) {
		throw Error("getSubdivisions -> " + e);
	}
}

function getCollaborators(subdivisionId: number) {
	try {
		const collaborators = selectAll<ICollaborator>(`
			SELECT
				t0.id,
				t0.fullname
			FROM dbo.collaborators t0
			WHERE t0.position_parent_id = ${subdivisionId}
		`);

		return collaborators;
	} catch (e) {
		throw Error("getCollaborators -> " + e);
	}
}

function handler(body: object, method: string) {
	const response = {
		success: true,
		error: false,
		data: [] as unknown
	};

	if (method === "getSubdivisions") {
		response.data = getSubdivisions();
	} else if (method === "getCollaborators") {
		const subdivisionId = OptInt(body.GetOptProperty("subdivisionId"));
		response.data = getCollaborators(subdivisionId);
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
