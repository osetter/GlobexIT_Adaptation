export interface ICollaborator {
	id: XmlElem<number>;
	fullname: XmlElem<string>;
	position_parent_id?: XmlElem<number>;
	history_state_state_id?: XmlElem<string>;
	history_state_start_date?: XmlElem<string>;
	history_state_finish_date?: XmlElem<string>;
	change_log_position_name?: XmlElem<string>;
	change_log_org_name?: XmlElem<string>;
	change_log_date?: XmlElem<string>;
	change_log_position_parent_name?: XmlElem<string>;
}