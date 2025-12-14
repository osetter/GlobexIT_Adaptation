//= require ./modules/req_headers.ts

import { DEV_MODE } from "../assesment-procedure/modules/devmode";

import { log } from "./utils/log";
import { selectAll, selectOne } from "./utils/query";
import { err } from "./utils/error";
import { getParam } from "./utils/param";

import { IRequestBody } from "./types/RequestBody";
import { ISubdivision } from "./types/Subdivision";
import { ICollaborator } from "./types/Collaborator";
import { ISubscription } from "./types/Subscription";


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

function getSubdivisionsHierarchy() {
	try {
		const subdivisions = selectAll<ISubdivision>(`
			SELECT
				t0.id,
				t0.name,
				t0.parent_object_id
			FROM dbo.subdivisions t0
		`);

		return subdivisions;
	} catch (e) {
		throw Error("getSubdivisionsHierarchy -> " + e);
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
				t0.fullname,
				t0.position_parent_id
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

function getUserSubscriptions() {
	try {
		const subscriptions = selectAll<ISubscription>(`
			SELECT
				t0.id AS subscription_id,
				t1.id AS person_id,
				t1.fullname,
				t1.position_parent_id
			FROM dbo.subscriptions t0
			INNER JOIN dbo.collaborators t1 ON t1.id = t0.document_id
			WHERE t0.person_id = ${curUserId}
			AND t0.type = 'collaborator'
		`);

		return subscriptions;
	} catch (e) {
		throw Error("getUserSubscriptions -> " + e);
	}
}

function addToTeam(collaboratorId: number) {
	try {
		const subscriptionDoc = tools.new_doc_by_name<SubscriptionDocument>("subscription");
		subscriptionDoc.BindToDb();
		const subscriptionDocTopElem = subscriptionDoc.TopElem;

		subscriptionDocTopElem.person_id = RValue(curUserId);
		subscriptionDocTopElem.type = "collaborator";
		subscriptionDocTopElem.document_id = RValue(collaboratorId);

		subscriptionDoc.Save();

		return { success: true };
	} catch (e) {
		throw Error("addToTeam -> " + e);
	}
}

function removeFromTeam(subscriptionId: number) {
	try {
		DeleteDoc(UrlFromDocID(subscriptionId));

		return { success: true };
	} catch (e) {
		log(`removeFromTeam error: ${e}`, "error");
		throw Error("removeFromTeam -> " + e);
	}
}

function getCollaboratorsExcludingTeam() {
	try {
		const subscribedIds = selectAll<{ person_id: XmlElem<number> }>(`
			SELECT DISTINCT
				t0.document_id AS person_id
			FROM dbo.subscriptions t0
			WHERE t0.type = 'collaborator'
			AND t0.person_id = ${curUserId}
			AND t0.document_id IN (
				SELECT t1.id
				FROM dbo.collaborators t1
			)
		`);

		if (subscribedIds.length === 0) {
			return getAllCollaboratorsList();
		}

		const subscribedIdsArray = subscribedIds.map((s) => RValue(s.person_id));
		const idsString = subscribedIdsArray.join(",");

		const collaborators = selectAll<ICollaborator>(`
			SELECT
				t0.id,
				t0.fullname,
				t0.position_parent_id
			FROM dbo.collaborators t0
			WHERE t0.id NOT IN (${idsString})
		`);

		return collaborators;
	} catch (e) {
		throw Error("getCollaboratorsExcludingTeam -> " + e);
	}
}

function handler(body: object, method: string) {
	const response = {
		success: true,
		error: false,
		data: [] as unknown
	};

	try {
		if (method === "getSubdivisions") {
			response.data = getSubdivisions();
		} else if (method === "getSubdivisionsHierarchy") {
			response.data = getSubdivisionsHierarchy();
		} else if (method === "getCollaborators") {
			const subdivisionId = OptInt(body.GetOptProperty("subdivisionId"));
			response.data = getSubdivisionCollaborators(subdivisionId);
		} else if (method === "getAllCollaboratorsList") {
			response.data = getAllCollaboratorsList();
		} else if (method === "getCollaboratorDetails") {
			const collaboratorId = OptInt(body.GetOptProperty("collaboratorId"));
			response.data = getCollaboratorDetails(collaboratorId);
		} else if (method === "getUserSubscriptions") {
			response.data = getUserSubscriptions();
		} else if (method === "addToTeam") {
			const collaboratorIdParam = body.GetOptProperty("collaboratorId");
			log(`handler: addToTeam called with collaboratorId param=${collaboratorIdParam} (type: ${ObjectType(collaboratorIdParam)})`, "INFO");
			const collaboratorId = OptInt(collaboratorIdParam);
			if (!collaboratorId || collaboratorId === 0) {
				throw Error(`collaboratorId is required and must be a valid number. Got: ${collaboratorIdParam}`);
			}
			log(`handler: addToTeam called with collaboratorId=${collaboratorId}`, "INFO");
			response.data = addToTeam(collaboratorId);
		} else if (method === "removeFromTeam") {
			const subscriptionId = OptInt(body.GetOptProperty("subscriptionId"));
			response.data = removeFromTeam(subscriptionId);
		} else if (method === "getCollaboratorsExcludingTeam") {
			response.data = getCollaboratorsExcludingTeam();
		} else {
			throw Error(`Unknown method: ${method}`);
		}
	} catch (e) {
		response.success = false;
		response.error = true;
		response.data = {
			message: String(e),
			error: true
		};
		log(`handler error for method ${method}: ${e}`, "error");
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
