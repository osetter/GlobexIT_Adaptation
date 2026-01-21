/**
 * @namespace Websoft.WT.Person
 */
/**
 * @typedef {Object} Employee
 * @property {string} id
 * @property {string} fullname
 * @property {string} login
 * @property {string} email
 */
/**
 * @typedef {Object} EmpInfo
 * @property {Employee[]} employees
 */
/**
 * @typedef {Object} GetListResult
 * @property {EmpInfo} empinfo
 */
/**
 * Получить список сотрудников построчно.
 * @function Get_list
 * @memberof Websoft.WT.Person
 * @returns {GetListResult} Объект с массивом сотрудников
 */
function _get_value(value) {
	try {
		return value == undefined ? "" : String(RValue(value));
	} catch (e) {
		return value == undefined ? "" : String(value);
	}
}

function _get_collaborators() {
	return ArraySelectAll(
		tools.xquery(
			"for $elem in collaborators return $elem/Fields('id','fullname','login','email')"
		)
	);
}

function Get_list() {
	var collabList = _get_collaborators();
	var employees = [];
	var collabItem;
	var collabId;
	var collabFullname;
	var collabLogin;
	var collabEmail;

	for (var i = 0; i < ArrayCount(collabList); i++) {
		collabItem = collabList[i];
		collabId = _get_value(collabItem.id);
		collabFullname = _get_value(collabItem.fullname);
		collabLogin = _get_value(collabItem.login);
		collabEmail = _get_value(collabItem.email);

		employees.push({
			id: collabId,
			fullname: collabFullname,
			login: collabLogin,
			email: collabEmail
		});
	}

	return {
		empinfo: {
			employees: employees
		}
	};
}

