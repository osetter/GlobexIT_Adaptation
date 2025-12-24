/* --- types --- */
interface ICollaborator {
    id: number;
    employee_name: string;
    hire_date: Date;
}

interface IManagerNotification {
    manager_id: number;
    manager_name: string;
    employees: ICollaborator[];
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
function sendManagerNotifications() {
	const sql = `
        SELECT 		
            fm.person_id as manager_id,
            fm.person_fullname AS manager_name,
            json_agg(
                json_build_object(
                    'id', c.id,
                    'employee_name', c.fullname,
                    'hire_date', c.hire_date
                )
            ) AS employees
        FROM dbo.collaborators c
        LEFT JOIN dbo.func_managers fm ON c.id = fm.object_id
        WHERE c.hire_date >= (CURRENT_DATE - INTERVAL '1 day')
        AND c.is_dismiss = false
        AND fm.is_native = true
        GROUP BY fm.person_fullname, fm.person_id
        ORDER BY fm.person_fullname
	`;

	const rows = selectAll<IManagerNotification>(sql);
	log("sendManagerNotifications: получено записей = " + ArrayCount(rows));
    
	let row: IManagerNotification;
    let employee: ICollaborator;
    let employeesList = "";

	for (row in rows) {
        const employeesArray: ICollaborator[] = ParseJson(String(row.employees));
        for (employee in employeesArray){
            tools.create_notification(OptInt(GLOBAL.NOTIFICATION_ID), OptInt(employee.id), String(row.manager_name));
            employeesList += employee.employee_name + ", ";
        }
        tools.create_notification(OptInt(GLOBAL.MANAGER_NOTIFICATION_ID), OptInt(row.manager_id), String(employeesList));
        employeesList = "";
	}     
}   
    /* --- start point --- */
function main() {
    try {
		sendManagerNotifications();
    } catch (err) {
        log("Выполнение прервано из-за ошибки: main -> " + err, "error");
    }
}

/* --- system --- */
const GLOBAL = {
	IS_DEBUG: tools_web.is_true(Param.IS_DEBUG),
	NOTIFICATION_ID: Param.NOTIFICATION_ID,
	MANAGER_NOTIFICATION_ID: Param.MANAGER_NOTIFICATION_ID
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

log("--- Начало. Агент Уведомлений новым сотрудникам и руководителям ---");

main();

log("--- Конец. Агент Уведомлений новым сотрудникам и руководителям ---");

export {};
