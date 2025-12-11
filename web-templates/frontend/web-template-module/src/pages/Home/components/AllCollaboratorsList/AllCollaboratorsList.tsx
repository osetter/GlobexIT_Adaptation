import { Spin } from 'antd';
import { Collaborator } from '@shared/types/wt-objects/collaborator';
import { CollaboratorCard } from '@shared/components/CollaboratorCard/CollaboratorCard';
import styles from './AllCollaboratorsList.module.scss';

interface AllCollaboratorsListProps {
	collaborators: Collaborator[];
	loading: boolean;
	searchQuery: string;
	onCollaboratorClick: (collaborator: Collaborator) => void;
}

export const AllCollaboratorsList = ({
	collaborators,
	loading,
	searchQuery,
	onCollaboratorClick,
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
				<CollaboratorCard
					key={collaborator.id}
					id={collaborator.id}
					fullname={collaborator.fullname}
					onClick={() => onCollaboratorClick(collaborator)}
				/>
			))}
		</div>
	);
};
