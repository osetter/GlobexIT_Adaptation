var funcManagersList;
var funcManagersQueryResult = XQuery('for $elem in func_managers where  $elem/object_id = ' + curUser.id + ' return $elem');
funcManagersList = funcManagersQueryResult;

COLUMNS = ([
	{"data": "person_id_fullname", "type": "string", "title": "ФИО"},
	{"data": "person_id_pict_url", "type": "string", "title": "URL к файлу фотографии"},
	{"data": "id", "type": "integer", "title": "ID"}
]);

RESULT = new Array();

var managerItem, elem, resultRow;
for (managerItem in funcManagersList) {
	RESULT.push((resultRow = new Object));
	elem = managerItem;
	elem = elem.person_id.OptForeignElem;
	if (elem == undefined) {
		resultRow.person_id_fullname = null;
	} else {
		elem = elem.Child('fullname');
		resultRow.person_id_fullname = (elem.HasValue ? elem.Value : null);
	}
	elem = managerItem;
	elem = elem.person_id.OptForeignElem;
	if (elem == undefined) {
		resultRow.person_id_pict_url = null;
	} else {
		elem = elem.Child('pict_url');
		resultRow.person_id_pict_url = (elem.HasValue ? elem.Value : null);
	}
	elem = managerItem;
	elem = elem.Child('id');
	resultRow.id = (elem.HasValue ? elem.Value : null);
}
