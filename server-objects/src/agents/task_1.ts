/* --- types --- */
interface IError {
	code: number;
	message: string;
}

/* --- utils --- */
/**
 * Выбирает все записи sql запроса
 * @param {string} query - sql-выражение
 */
function selectAll<T>(query: string) {
	return ArraySelectAll<T>(tools.xquery(`sql: ${query}`));
}

/**
 * Создает поток ошибки с объектом error
 * @param {object} source - источник ошибки
 * @param {object} errorObject - объект ошибки
 */
function HttpError(source: string, error: IError) {
	throw new Error(source + " -> " + error);
}

/* --- logic --- */
function getColls() {
	try {
		selectAll("SELECT * FROM collaborators");
	} catch (err) {
		HttpError("getColls", err as IError);
	}
}

/* --- start point --- */
function main() {
	try {
		getColls();
	} catch (err) {
		log("Выполнение прервано из-за ошибки: main -> " + err, "error");
	}
}

/* --- system --- */
const GLOBAL = {
	IS_DEBUG: tools_web.is_true(Param.IS_DEBUG)
};

const logConfig = {
	code: "globex_log",
	type: "AGENT",
	agentId: ""
};

EnableLog(logConfig.code, GLOBAL.IS_DEBUG);

/**
 * Вывод сообщения в журнал
 * @param {string} message - Сообщение
 * @param {string} type - Тип сообщения info/error
 */
function log(message: string, type?: string) {
	type = IsEmptyValue(type) ? "INFO" : StrUpperCase(type);

	if (ObjectType(message) === "JsObject" || ObjectType(message) === "JsArray" || ObjectType(message) === "XmLdsSeq") {
		message = tools.object_to_text(message, "json");
	}

	const log = `[${type}][${logConfig.type}][${logConfig.agentId}]: ${message}`;
	if (LdsIsServer) {
		LogEvent(logConfig.code, log);
	} else if (GLOBAL.IS_DEBUG) {
		// eslint-disable-next-line no-alert
		alert(log);
	}
}

log("--- Начало. Агент {название агента} ---");

main();

log("--- Конец. Агент {название агента} ---");

export {};
