/* --- types --- */
interface IError {
	code: number;
	message: string;
}

/* --- utils --- */
/**
 * Создает поток ошибки с объектом error
 * @param {object} source - источник ошибки
 * @param {object} errorObject - объект ошибки
 */
function HttpError(source: string, error: IError) {
	throw new Error(source + " -> " + error);
}

/* --- logic --- */
function setCollaboratorCredentials(collaboratorId: number, password: string) {
	try {
		const docCollaborator = tools.open_doc<CollaboratorDocument>(collaboratorId);
		const docCollaboratorTE = docCollaborator.TopElem;

		docCollaboratorTE.password.Value = password;
		
		docCollaborator.Save();
	} catch (err) {
		HttpError("setCollaboratorCredentials", err);
	}
}

function generateRandomPassword(length: number): string {
	const passwordDict = "QWERTYUPASDFGHJKLZXCVBNMqwertyuipasdfghjkzxcvbnm123456789!@#$%^&*_+-=?";
	return tools.random_string(length, passwordDict);
}

/* --- start point --- */
function main() {
	try {
		const collaboratorId = OptInt(OBJECTS_ID_STR);
		const password = generateRandomPassword(12);

		setCollaboratorCredentials(collaboratorId, password);
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

log("--- Начало. Агент установки случайных логинов и паролей ---");

main();

log("--- Конец. Агент установки случайных логинов и паролей ---");

export {};
