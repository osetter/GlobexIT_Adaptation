
/* --- types --- */
interface IError {
    code: number;
    message: string;
}

interface ISectionData {
    title: string;
    date: string;
    description: string;
    access_group: string;
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
function createPortalCard(data: ISectionData) {
    try {
		const docNew = tools.new_doc_by_name<DocumentDocument>('document');
		docNew.BindToDb();
		const te = docNew.TopElem;

		te.name.Value = data.title;
        te.comment.Value = data.description;
		te.create_date.Value = OptDate(data.date);
		te.parent_document_id.Value = OptInt(GLOBAL.PARENT_DOCUMENT_ID);
        te.access.access_groups.ObtainChildByKey(OptInt(data.access_group));

		docNew.Save();

		log("Успешно создана карточка: " + data.title);
    } catch (err) {
        log("Не удалось создать карточку '" + data.title + "': " + err, "error");
    }
}

function processImport() {
	// let filePath = Screen.AskFileOpen()
	let file = LoadUrlData(GLOBAL.FILE_PATH);
	file = ParseJson(file)
	
	let item: ISectionData
	// @ts-ignore жалуется на in .. вместо of ..
	for (item in file) {
		createPortalCard(item)
	}
}

/* --- start point --- */
function main() {
	try {
		processImport();
	} catch (err) {
		log("Выполнение прервано из-за ошибки: main -> " + err, "error");
	}
}

/* --- system --- */
const GLOBAL = {
	IS_DEBUG: tools_web.is_true(Param.IS_DEBUG),
	FILE_PATH: String(Param.FILE_PATH),
	PARENT_DOCUMENT_ID: Param.PARENT_DOCUMENT_ID
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

log("--- Начало. Агент импорта карточек разделов ---");

main();

log("--- Конец. Агент импорта карточек разделов ---");

export {};
