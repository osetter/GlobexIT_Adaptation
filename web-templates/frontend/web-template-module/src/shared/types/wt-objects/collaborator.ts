export interface Collaborator {
	id: number;
	fullname: string;
	position_parent_id?: number;
	history_state_state_id?: string;
	history_state_start_date?: string;
	history_state_finish_date?: string;
	change_log_org_name?: string;
	change_log_position_parent_name?: string;
	change_log_position_name?: string;
	change_log_date?: string;
}
