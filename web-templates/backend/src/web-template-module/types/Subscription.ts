export interface ISubscription {
	id: XmlElem<number>;
	type: XmlElem<string>;
	person_id: XmlElem<number>;
	person_fullname: XmlElem<string>;
	person_org_name?: XmlElem<string>;
	user_id?: XmlElem<number>; // Добавить это поле
	create_date?: XmlElem<Date>;
	modification_date?: XmlElem<Date>;
}

