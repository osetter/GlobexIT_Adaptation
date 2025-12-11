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

function getSubdivisionCollaborators(subdivisionId: number) {
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

function getAllCollaboratorsList() {
	try {
		const collaborators = selectAll<ICollaborator>(`
			SELECT
				t0.id,
				t0.fullname
			FROM dbo.collaborators t0
		`);

		return collaborators;
	} catch (e) {
		throw Error("getAllCollaboratorsList -> " + e);
	}
}

function getCollaboratorDetails(collaboratorId: number) {
	try {
		const collaborators = selectAll<ICollaborator>(`
			SELECT
				t0.id,
				t1.fullname,
				
				-- Поля history_states
				unnest(xpath('/collaborator/history_states/history_state/state_id/text()', t0.data::xml))::text AS history_state_state_id,
				unnest(xpath('/collaborator/history_states/history_state/start_date/text()', t0.data::xml))::text AS history_state_start_date,
				unnest(xpath('/collaborator/history_states/history_state/finish_date/text()', t0.data::xml))::text AS history_state_finish_date,
				
				-- Поля change_log
				unnest(xpath('/collaborator/change_logs/change_log/org_name/text()', t0.data::xml))::text AS change_log_org_name,
				unnest(xpath('/collaborator/change_logs/change_log/position_parent_name/text()', t0.data::xml))::text AS change_log_position_parent_name,
				unnest(xpath('/collaborator/change_logs/change_log/position_name/text()', t0.data::xml))::text AS change_log_position_name,
				unnest(xpath('/collaborator/change_logs/change_log/date/text()', t0.data::xml))::text AS change_log_date
			FROM
				dbo.collaborator t0
			JOIN dbo.collaborators t1 ON t0.id = t1.id
			WHERE t0.id = ${collaboratorId}
		`);
		
		return collaborators;
	} catch (e) {
		throw Error("getCollaboratorDetails -> " + e);
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
		response.data = getSubdivisionCollaborators(subdivisionId);
	} else if (method === "getAllCollaboratorsList") {
		response.data = getAllCollaboratorsList();
	} else if (method === "getCollaboratorDetails") {
		const collaboratorId = OptInt(body.GetOptProperty("collaboratorId"));
		response.data = getCollaboratorDetails(collaboratorId);
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
