import { Spin } from 'antd';
import { Collaborator } from '@shared/types/wt-objects/collaborator';
import { CollaboratorCard } from '@shared/components/CollaboratorCard/CollaboratorCard';
import styles from './CollaboratorsList.module.scss';

interface CollaboratorsListProps {
	collaborators: Collaborator[];
	loading: boolean;
	subdivisionName: string;
}

export const CollaboratorsList = ({
	collaborators,
	loading,
	subdivisionName,
}: CollaboratorsListProps) => {
	if (loading) {
		return (
			<div className={styles['collaborators-list__loader']}>
				<Spin size="large" />
			</div>
		);
	}

	if (collaborators.length === 0) {
		return (
			<div className={styles['collaborators-list__empty']}>
				В подразделении "{subdivisionName}" нет сотрудников
			</div>
		);
	}

	return (
		<div className={styles['collaborators-list']}>
			<h2 className={styles['collaborators-list__title']}>
				Сотрудники: {subdivisionName}
			</h2>
			<div className={styles['collaborators-list__content']}>
				{collaborators.map((collaborator) => (
					<CollaboratorCard
						key={collaborator.id}
						id={collaborator.id}
						fullname={collaborator.fullname}
					/>
				))}
			</div>
		</div>
	);
};
