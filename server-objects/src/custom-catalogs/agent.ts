/* --- types --- */
interface IColl {
	code: string;
	fullname: string;
	position_code: string;
	position_name: string;
	group_code: string;
}

interface CcAdaptationCatalogDocument extends XmlDocument {
	TopElem: XmlTopElem & {
		code: XmlElem<string>;
		fullname: XmlElem<string>;
		position_code: XmlElem<string>;
		position_name: XmlElem<string>;
		group_code: XmlElem<string>;
	};
}

interface IError {
	code: number;
	message: string;
}

interface ICollaboratorId {
	id: number;
}

interface IGroupCollaborator {
	collaborator_id: number;
}

/* --- utils --- */
/**
 * Создает поток ошибки с объектом error
 */
function HttpError(source: string, errorObject: IError) {
	throw new Error(source + " " + errorObject.message);
}

/**
 * Выбирает все записи sql запроса
 */
function selectAll<T>(query: string) {
	return ArraySelectAll<T>(tools.xquery(`sql: ${query}`));
}

/**
 * Получение id сотрудника по code (из Excel)
 */
function getCollaboratorId(code: string): number | null {
	const rows = selectAll<ICollaboratorId>(`
		SELECT 
			id
		FROM dbo.collaborators
		WHERE code = '${code}';
	`);

	return rows.length ? OptInt(rows[0].id) : null;
}

/**
 * Проверка: состоит ли сотрудник в группе
 */
function isInGroup(groupId: number, collaboratorId: number): boolean {
	const rows = selectAll<IGroupCollaborator>(`
		SELECT 
			collaborator_id
		FROM dbo.group_collaborators
		WHERE group_id = ${groupId}
		AND collaborator_id = ${collaboratorId};
	`);

	return rows.length > 0;
}

/**
 * Проверка сотрудника по code
 */
function isAllowed(code: string): boolean {
	if (IsEmptyValue(code)) {
		return false;
	}

	const collaboratorId = getCollaboratorId(code);
	if (collaboratorId == null) {
		return false;
	}

	if (GLOBAL.GROUP_ID == undefined) {
		return true;
	}

	return isInGroup(GLOBAL.GROUP_ID, collaboratorId);
}

function openExcelFile(sFileUrl: string) {
	try {
		const filePath = UrlToFilePath(sFileUrl);
		const excel = tools.get_object_assembly("Excel");
		excel.Open(filePath);

		const worksheet = excel.GetWorksheet(0);

		return worksheet.Cells;
	} catch (e) {
		HttpError("openExcelFile", {
			code: 500,
			message: `Ошибка загрузки Excel: ${e.message}`,
		});
	}
}

function getCellValue(cells: any, row: number, col: number): string {
	try {
		let columnName = "";
		let index = col;

		while (index >= 0) {
			columnName = String.fromCharCode(65 + (index % 26)) + columnName;
			index = OptInt(index / 26) - 1;
		}

		const cell = cells.GetCell(columnName + (row + 1));
		if (!cell || cell.Value == null) return "";

		const value = Trim(String(cell.Value));

		return value === "undefined" ? "" : value;
	} catch (e) {
		HttpError("getCellValue", {
			code: 404,
			message: `Ошибка чтения ячейки [${row}, ${col}]: ${e.message}`,
		});

		return "";
	}
}

function findCatalogEntry(code: string): any {
	const query =
		`for $e in cc_custom_catalog_task
		 where $e/data/TopElem/code = ${code}
		 return $e`;

	const result = tools.xquery(query);

	return ArrayOptFirstElem(result);
}

/* --- logic --- */
function importExcel(sFileUrl: string) {
	try {
		const cells = openExcelFile(sFileUrl);

		let row = 1;
		let codeExcel: string;
		let personData: IColl;

		// eslint-disable-next-line no-constant-condition
		while (true) {
			codeExcel = getCellValue(cells, row, 0);
			if (!codeExcel) break;

			try {
				personData = {
					code: codeExcel,
					fullname: getCellValue(cells, row, 1),
					position_code: getCellValue(cells, row, 2),
					position_name: getCellValue(cells, row, 3),
					group_code: getCellValue(cells, row, 4),
				};

				if (!isAllowed(personData.code)) {
					row++;
					continue;
				}

				createCatalogEntry(personData);
			} catch (err) {
				log(`Ошибка в строке ${row}: ${err.message || err}`, "error");
			}

			row++;
		}
	} catch (e) {
		HttpError("importExcel", {
			code: 500,
			message: `Ошибка чтения файла: ${e.message}`,
		});
	}
}

function createCatalogEntry(cardData: IColl) {
	const exists = findCatalogEntry(cardData.code);
	if (exists) {
		log(`Карточка ${cardData.code} уже существует`, "info");

		return;
	}

	const doc: CcAdaptationCatalogDocument =
		tools.new_doc_by_name("cc_custom_catalog_task");
	doc.BindToDb();

	doc.TopElem.code.Value = cardData.code;
	doc.TopElem.fullname.Value = cardData.fullname;
	doc.TopElem.position_code.Value = cardData.position_code;
	doc.TopElem.position_name.Value = cardData.position_name;
	doc.TopElem.group_code.Value = cardData.group_code;

	doc.Save();
}

/* --- start point --- */
function main() {
	if (GLOBAL.FILE_IMPORT == undefined) {
		HttpError("main", {
			code: 500,
			message: "Не указан файл импорта",
		});
	}

	const doc = tools.open_doc<ResourceDocument>(GLOBAL.FILE_IMPORT);


	const fileUrl = doc.TopElem.file_url.Value;
	const tempUrl = ObtainSessionTempFile(StrLowerCase(UrlPathSuffix(fileUrl)));

	doc.TopElem.get_data(tempUrl);
	importExcel(tempUrl);
}

/* --- system --- */
const GLOBAL = {
	IS_DEBUG: tools_web.is_true(Param.IS_DEBUG),
	FILE_IMPORT: OptInt(Param.FILE_IMPORT),
	GROUP_ID: OptInt(Param.GROUP_ID),
};

const logConfig = {
	code: "globex_log",
	type: "AGENT",
	agentId: "",
};

EnableLog(logConfig.code, GLOBAL.IS_DEBUG);

/**
 * Вывод сообщения в журнал
 */
function log(message: string, type?: string) {
	type = IsEmptyValue(type) ? "INFO" : StrUpperCase(type);

	if (
		ObjectType(message) === "JsObject"
		|| ObjectType(message) === "JsArray"
		|| ObjectType(message) === "XmLdsSeq"
	) {
		message = tools.object_to_text(message, "json");
	}

	const logText = `[${type}][${logConfig.type}][${logConfig.agentId}]: ${message}`;
	if (LdsIsServer) {
		LogEvent(logConfig.code, logText);
	} else if (GLOBAL.IS_DEBUG) {
		alert(logText);
	}
}

log("--- Начало Агент импорта сотрудников в кастомный каталог на основе excel файла ---");
main();
log("--- Конец Агент импорта сотрудников в кастомный каталог на основе excel файлав ---");

export {};
