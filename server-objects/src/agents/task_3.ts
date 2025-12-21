/* --- types --- */
interface IError {
	code: number;
	message: string;
}

/* --- utils --- */
declare const tools: any;
declare const OpenDoc: (url: string, params?: string) => any;
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

/**
 * Возвращает id сотрудника по логину или null, если не найден
 * @param {string} login - исходное значение логина
 */
function getPersonIdByLogin(login: string): number | null {
    const sQuery = "select id from dbo.collaborators where login = " + SqlLiteral(login);
    const arrResult = selectAll<{ id: string }>(sQuery);
    const oFoundPerson = ArrayOptFirstElem(arrResult);
    return oFoundPerson !== undefined ? OptInt(oFoundPerson.id) : null;
}

/**
 * Находит существующую должность или создает новую и возвращает её id
 * @param {string} position - исходное значение названия должности
 */
function getOrCreatePositionId(position: string): number {
    const sQuery = "select id from dbo.positions where name = " + SqlLiteral(position);
    const arrResult = ArraySelectAll<{ id: string }>(tools.xquery("sql: " + sQuery));
    const oFoundPos = ArrayOptFirstElem(arrResult);

    if (oFoundPos !== undefined) {
        return Int(oFoundPos.id);
    }

    const docNewPos = tools.new_doc_by_name("position");
    docNewPos.BindToDb();
    docNewPos.TopElem.name = position;
    docNewPos.Save();
    return Int(docNewPos.DocID);
}

/**
 * Создает или обновляет карточку сотрудника на основе строки Excel
 * @param {object} rowData - данные строки: ФИО, логин, пароль, должность, пол
 */
function syncCollaborator(rowData: any): void {
    const iPersonId = getPersonIdByLogin(rowData.login);
    const iPosId = getOrCreatePositionId(rowData.posName);
    let docCol: any;

    if (iPersonId !== null) {
        docCol = tools.open_doc_get_obj(iPersonId);
    } else {
        docCol = tools.new_doc_by_name("collaborator");
        docCol.TopElem.login = String(rowData.login);
    }

    docCol.TopElem.lastname = String(rowData.lastName);
    docCol.TopElem.firstname = String(rowData.firstName);
    docCol.TopElem.middlename = String(rowData.middleName);
    docCol.TopElem.password = String(rowData.pass);
    docCol.TopElem.position_id = iPosId;

    const sGender = String(rowData.gender);
    docCol.TopElem.sex = sGender;

    docCol.BindToDb();
    docCol.Save();
}
/* --- logic --- */
function runImport(): void {
    try {
        const sUrl = "x-local://wt_data/attachments/sbe5jkjw16/7234994234107568081.xlsx";
        
        
        const excelDoc = OpenDoc(sUrl, "format=excel");
        const sheet = excelDoc.TopElem[0]; 
        const iRowsCount = ArrayCount(sheet);
        let row;
        let rowData;

        for (let i = 1; i < iRowsCount; i++) {
            try {
                row = sheet[i];
                
                rowData = {
                    lastName: String(row[0]),
                    firstName: String(row[1]),
                    middleName: String(row[2]),
                    login: String(row[3]),
                    pass: String(row[4]),
                    posName: String(row[5]),
                    gender: String(row[6])
                };

                if (rowData.login !== "" && rowData.login !== "undefined") {
                    syncCollaborator(rowData);
                }
            } catch (e) {
            }
        }
    } catch (err) {
    }
}

/* --- start point --- */
function main() {
	try {
		runImport();
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

log("--- Начало. Агент Cоздать карточки сотрудников и карточки должностей на основе excel файла. ---");

main();

log("--- Конец. Агент Cоздать карточки сотрудников и карточки должностей на основе excel файла. ---");

export {};
