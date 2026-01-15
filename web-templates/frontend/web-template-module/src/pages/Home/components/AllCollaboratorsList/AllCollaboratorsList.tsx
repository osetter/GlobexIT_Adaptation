import { Spin, Button, Tooltip } from 'antd';
import { UserAddOutlined } from '@ant-design/icons';
import { Collaborator } from '@shared/types/wt-objects/collaborator';
import { CollaboratorCard } from '@shared/components/CollaboratorCard/CollaboratorCard';
import styles from './AllCollaboratorsList.module.scss';

interface AllCollaboratorsListProps {
	collaborators: Collaborator[];
	loading: boolean;
	searchQuery: string;
	onCollaboratorClick: (collaborator: Collaborator) => void;
	onAddToTeam: (collaboratorId: number) => void;
	addingToTeam?: boolean;
}

export const AllCollaboratorsList = ({
	collaborators,
	loading,
	searchQuery,
	onCollaboratorClick,
	onAddToTeam,
	addingToTeam = false,
}: AllCollaboratorsListProps) => {
	if (loading) {
		return (
			<div className={styles['all-collaborators-list__loader']}>
				<Spin size="large" />
			</div>
		);
	}

	if (collaborators.length === 0) {
		return (
			<div className={styles['all-collaborators-list__empty']}>
				{searchQuery
					? 'Сотрудники не найдены'
					: 'Нет доступных сотрудников'}
			</div>
		);
	}

	return (
		<div className={styles['all-collaborators-list']}>
			{collaborators.map((collaborator) => (
				<div
					key={collaborator.id}
					className={styles['all-collaborators-list__item']}
				>
					<CollaboratorCard
						id={collaborator.id}
						fullname={collaborator.fullname}
						onClick={() => onCollaboratorClick(collaborator)}
					/>
					<Tooltip title="Добавить в команду">
						<Button
							type="primary"
							icon={<UserAddOutlined />}
							onClick={() => onAddToTeam(collaborator.id)}
							loading={addingToTeam}
							className={styles['all-collaborators-list__action']}
						>
							Добавить в команду
						</Button>
					</Tooltip>
				</div>
			))}
		</div>
	);
};
