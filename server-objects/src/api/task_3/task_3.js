/**
 * @namespace Websoft.WT.Collaborator_API
 * @description API для управления карточками сотрудников
 */

/**
 * @typedef {Object} CollaboratorInfo
 * @property {number} id - Идентификатор сотрудника
 * @property {string} code - Табельный номер
 * @property {string} fullname - ФИО
 * @property {string} login - Логин
 * @property {string} email - Email
 * @property {string} position_name - Должность
 */

/**
 * @typedef {Object} CollaboratorListResponse
 * @property {CollaboratorInfo[]} data - Массив сотрудников
 */

/**
 * Получение списка всех сотрудников из базы данных
 * @function FetchCollaborators
 * @memberof Websoft.WT.Collaborator_API
 * @returns {CollaboratorListResponse}
 */
function FetchCollaborators() {
	var response = {
		data: []
	};

	try {
		var queryResult = tools.xquery("for $elem in collaborators return $elem");
		var record;

		for (record in queryResult) {
			response.data.push({
				id: record.id.Value,
				code: record.code.Value,
				fullname: record.fullname.Value,
				login: record.login.Value,
				email: record.email.Value,
				position_name: record.position_name.Value
			});
		}
	} catch (err) {
		throw new Error("FetchCollaborators -> " + err.message);
	}

	return response;
}

/**
 * @typedef {Object} NameComponents
 * @property {string} lastName - Фамилия
 * @property {string} firstName - Имя
 * @property {string} middleName - Отчество
 */

/**
 * Разбор строки ФИО на составные части
 * @function SplitFullName
 * @memberof Websoft.WT.Collaborator_API
 * @param {string} fullName - Строка ФИО в формате "Фамилия Имя Отчество"
 * @returns {NameComponents}
 */
function SplitFullName(fullName) {
	var result = {
		lastName: "",
		firstName: "",
		middleName: ""
	};

	if (fullName == undefined || fullName == "") {
		return result;
	}

	var firstSpace = fullName.indexOf(" ");
	var secondSpace = fullName.indexOf(" ", firstSpace + 1);

	result.lastName = fullName.substring(0, firstSpace);
	result.firstName = fullName.substring(firstSpace + 1, secondSpace);
	result.middleName = fullName.substring(secondSpace + 1);

	return result;
}

/**
 * @typedef {Object} CollaboratorInput
 * @property {string} code - Табельный номер (обязательное)
 * @property {string} fullname - ФИО сотрудника
 * @property {string} login - Логин
 * @property {string} password - Пароль
 */

/**
 * @typedef {Object} SyncResult
 * @property {number} created - Количество созданных
 * @property {number} updated - Количество обновленных
 */

/**
 * Синхронизация данных сотрудников. Создает новые карточки или обновляет существующие по табельному номеру.
 * @function SyncCollaborators
 * @memberof Websoft.WT.Collaborator_API
 * @param {CollaboratorInput[]} inputData - Массив данных сотрудников
 * @returns {SyncResult}
 */
function SyncCollaborators(inputData) {
	var stats = {
		created: 0,
		updated: 0
	};

	var entry;
	var doc;
	var isNewRecord;
	var existingRecord;
	var topElem;
	var nameData;

	try {
		if (!IsArray(inputData) || ArrayCount(inputData) == 0) {
			throw new Error("Ожидается непустой массив данных");
		}

		for (entry in inputData) {
			if (entry.code == undefined || entry.code == "") {
				throw new Error("Не указан табельный номер (code)");
			}

			existingRecord = ArrayOptFirstElem(
				tools.xquery(
					"for $elem in collaborators where $elem/code = '" + entry.code + "' return $elem"
				)
			);

			if (existingRecord != undefined) {
				doc = tools.open_doc(existingRecord.id);
				isNewRecord = false;
			} else {
				doc = tools.new_doc_by_name("collaborator", false);
				doc.BindToDb();
				isNewRecord = true;
			}

			topElem = doc.TopElem;

			nameData = SplitFullName(entry.fullname);
			topElem.lastname = nameData.lastName;
			topElem.firstname = nameData.firstName;
			topElem.middlename = nameData.middleName;

			topElem.login = entry.login;
			topElem.password = entry.password;

			if (isNewRecord) {
				topElem.code = entry.code;
			}

			doc.Save();

			if (isNewRecord) {
				stats.created++;
			} else {
				stats.updated++;
			}
		}

	} catch (err) {
		throw new Error("SyncCollaborators -> " + err.message);
	}

	return stats;
}
