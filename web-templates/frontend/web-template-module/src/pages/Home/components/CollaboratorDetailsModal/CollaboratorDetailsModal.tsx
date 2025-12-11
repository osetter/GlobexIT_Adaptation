import { Modal, Spin, Descriptions, Table } from 'antd';
import { Collaborator } from '@shared/types/wt-objects/collaborator';
import styles from './CollaboratorDetailsModal.module.scss';

interface CollaboratorDetailsModalProps {
	open: boolean;
	onClose: () => void;
	collaborator: Collaborator | null;
	details: Collaborator[] | null;
	loading: boolean;
}

interface HistoryState {
	state_id: string;
	start_date: string;
	finish_date: string;
}

interface ChangeLog {
	org_name: string;
	position_parent_name: string;
	position_name: string;
	date: string;
}

export const CollaboratorDetailsModal = ({
	open,
	onClose,
	collaborator,
	details,
	loading,
}: CollaboratorDetailsModalProps) => {
	if (!collaborator) {
		return null;
	}

	const historyStates: HistoryState[] = [];
	const changeLogs: ChangeLog[] = [];

	if (details && details.length > 0) {
		const statesMap = new Map<string, HistoryState>();
		details.forEach((detail) => {
			if (
				detail.history_state_state_id &&
				detail.history_state_start_date
			) {
				const key = `${detail.history_state_state_id}_${detail.history_state_start_date}`;
				if (!statesMap.has(key)) {
					statesMap.set(key, {
						state_id: detail.history_state_state_id,
						start_date: detail.history_state_start_date || '',
						finish_date: detail.history_state_finish_date || '',
					});
				}
			}
		});
		historyStates.push(...Array.from(statesMap.values()));

		const logsMap = new Map<string, ChangeLog>();
		details.forEach((detail) => {
			if (detail.change_log_date && detail.change_log_org_name) {
				const key = `${detail.change_log_date}_${detail.change_log_org_name}`;
				if (!logsMap.has(key)) {
					logsMap.set(key, {
						org_name: detail.change_log_org_name || '',
						position_parent_name:
							detail.change_log_position_parent_name || '',
						position_name: detail.change_log_position_name || '',
						date: detail.change_log_date || '',
					});
				}
			}
		});
		changeLogs.push(...Array.from(logsMap.values()));
	}

	const historyStatesColumns = [
		{
			title: 'ID состояния',
			dataIndex: 'state_id',
			key: 'state_id',
		},
		{
			title: 'Дата начала',
			dataIndex: 'start_date',
			key: 'start_date',
		},
		{
			title: 'Дата окончания',
			dataIndex: 'finish_date',
			key: 'finish_date',
		},
	];

	const changeLogsColumns = [
		{
			title: 'Организация',
			dataIndex: 'org_name',
			key: 'org_name',
		},
		{
			title: 'Подразделение',
			dataIndex: 'position_parent_name',
			key: 'position_parent_name',
		},
		{
			title: 'Должность',
			dataIndex: 'position_name',
			key: 'position_name',
		},
		{
			title: 'Дата',
			dataIndex: 'date',
			key: 'date',
		},
	];

	return (
		<Modal
			open={open}
			onCancel={onClose}
			footer={null}
			width={800}
			title={`Детали сотрудника: ${collaborator.fullname}`}
		>
			{loading ? (
				<div className={styles['modal__loader']}>
					<Spin size="large" />
				</div>
			) : (
				<div className={styles['modal__content']}>
					<Descriptions
						title="Основная информация"
						bordered
						column={1}
						className={styles['modal__descriptions']}
					>
						<Descriptions.Item label="ID">
							{collaborator.id}
						</Descriptions.Item>
						<Descriptions.Item label="ФИО">
							{collaborator.fullname}
						</Descriptions.Item>
					</Descriptions>

					<div className={styles['modal__section']}>
						<h3 className={styles['modal__section-title']}>
							История состояний
						</h3>
						{historyStates.length > 0 ? (
							<Table
								dataSource={historyStates}
								columns={historyStatesColumns}
								rowKey={(record, index) =>
									`${record.state_id}_${index}`
								}
								pagination={false}
								size="small"
							/>
						) : (
							<p className={styles['modal__empty']}>
								Нет данных о состояниях
							</p>
						)}
					</div>

					<div className={styles['modal__section']}>
						<h3 className={styles['modal__section-title']}>
							История изменений
						</h3>
						{changeLogs.length > 0 ? (
							<Table
								dataSource={changeLogs}
								columns={changeLogsColumns}
								rowKey={(record, index) =>
									`${record.date}_${index}`
								}
								pagination={false}
								size="small"
							/>
						) : (
							<p className={styles['modal__empty']}>
								Нет данных об изменениях
							</p>
						)}
					</div>
				</div>
			)}
		</Modal>
	);
};
