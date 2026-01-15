/* --- types --- */
interface ICollaborator {
    id: number;
    employee_name: string;
    hire_date: Date;
    manager_name: string;
}
/* --- utils --- */
/**
 * Выбирает все записи sql запроса
 * @param {string} query - sql-выражение
 */
function selectAll<T>(query: string) {
	return ArraySelectAll<T>(tools.xquery(`sql: ${query}`));
}

/* --- logic --- */
function sendNotifications() {
	const sql = `
		SELECT 
			c.id, 
			c.fullname AS employee_name, 
			c.hire_date, 
			fm.person_fullname AS manager_name
		FROM dbo.collaborators c
		LEFT JOIN dbo.func_managers fm ON c.id = fm.object_id
		WHERE c.hire_date >= (CURRENT_DATE - INTERVAL '1 day')
		  AND c.is_dismiss = false
		ORDER BY c.hire_date DESC
	`;

	const rows = selectAll<ICollaborator>(sql);
	log("sendNotifications: получено записей = " + ArrayCount(rows));
	let row : ICollaborator;
	for (row in rows) {
        try {
            tools.create_notification(OptInt(GLOBAL.NOTIFICATION_ID), OptInt(row.id), String(row.manager_name));
            log("Запись успешно создана в Очереди сообщений для: " + row.employee_name);
        } catch (err) {
            log("Ошибка при выполнении функции create_notification " + row.employee_name + " (ID: " + row.id + "): " + err, "error");
        }
    }
}
	
/* --- start point --- */
function main() {
    try {
		sendNotifications()
    } catch (err) {
        log("Выполнение прервано из-за ошибки: main -> " + err, "error");
    }
}

/* --- system --- */
const GLOBAL = {
	IS_DEBUG: tools_web.is_true(Param.IS_DEBUG),
	NOTIFICATION_ID: Param.NOTIFICATION_ID
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

log("--- Начало. Агент Агент Уведомлений новым сотрудникам ---");

main();

log("--- Конец. Агент Агент Уведомлений новым сотрудникам ---");

export {};
