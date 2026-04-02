var collaboratorsList;
var collaboratorsQueryResult = XQuery('for $elem in collaborators where  $elem/id = ' + curUser.id + ' return $elem');
collaboratorsList = collaboratorsQueryResult;

var docCache;

function getCachedDoc(docId) {
	var doc;
	if (docCache.HasProperty(docId)) {
		return docCache[docId];
	} else {
		doc = tools.open_doc(docId);
		if (doc != undefined) doc = doc.TopElem;
		docCache[docId] = doc;
		return doc;
	}
}

COLUMNS = ([
	{"data": "tab_num", "type": "string", "title": "Табельный номер"},
	{"data": "id", "type": "integer", "title": "ID"}
]);

RESULT = new Array();

var collaboratorItem, elem, resultRow;
for (collaboratorItem in collaboratorsList) {
	RESULT.push((resultRow = new Object));
	docCache = new Object;
	elem = collaboratorItem;
	elem = ArrayOptFindByKey(getCachedDoc(elem.PrimaryKey).custom_elems, 'tab_num', 'name');
	resultRow.tab_num = (elem != undefined ? elem.value.Value : null);
	elem = collaboratorItem;
	elem = elem.Child('id');
	resultRow.id = (elem.HasValue ? elem.Value : null);
}
