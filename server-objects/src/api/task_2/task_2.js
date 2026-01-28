/**
 * @namespace Websoft.WT.Person_API
 * @description API для получения данных о сотрудниках организации
 */

/**
 * @typedef {Object} EmployeeInfo
 * @property {string} id - Идентификатор сотрудника
 * @property {string} code - Табельный номер
 * @property {string} fullname - ФИО сотрудника
 * @property {string} login - Учетная запись
 * @property {string} email - Электронная почта
 * @property {string} position_name - Должность
 */

/**
 * @typedef {Object} EmployeesResponse
 * @property {number} error - Статус ошибки (0 - успех)
 * @property {string} errorText - Описание ошибки
 * @property {boolean} result - Флаг успешного выполнения
 * @property {EmployeeInfo[]} array - Список сотрудников
 */

/**
 * Преобразует значение в строку, возвращает пустую строку для null/undefined
 * @param {*} val - Исходное значение
 * @returns {string} Безопасное строковое значение
 */
function toSafeString(val) {
	return val != null ? String(val) : "";
}

/**
 * Возвращает список всех сотрудников из базы
 * @function Get_All_Employees
 * @memberof Websoft.WT.Person_API
 * @returns {EmployeesResponse} Объект с результатом и массивом сотрудников
 */
function Get_All_Employees() {
	var response = {
		error: 0,
		errorText: "",
		result: true,
		array: []
	};

	try {
		var allCollaborators = tools.xquery("for $elem in collaborators return $elem");
		var iCollaborator;
		var objItem;

		for (iCollaborator in allCollaborators) {
			objItem = {
				id: toSafeString(iCollaborator.id.Value),
				code: toSafeString(iCollaborator.code.Value),
				fullname: toSafeString(iCollaborator.fullname.Value),
				login: toSafeString(iCollaborator.login.Value),
				email: toSafeString(iCollaborator.email.Value),
				position_name: toSafeString(iCollaborator.position_name.Value)
			};
			response.array.push(objItem);
		}
	} catch (ex) {
		response.error = 1;
		response.errorText = "Не удалось получить список сотрудников: " + String(ex);
		response.result = false;
	}

	return response;
}
