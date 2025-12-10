import { Spin } from 'antd';
import { CollaboratorCard } from '@shared/components/CollaboratorCard/CollaboratorCard';
import { Collaborator } from '@shared/types/wt-objects/collaborator';
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
			<p className={styles['collaborators-list__empty']}>
				В данном подразделении нет сотрудников
			</p>
		);
	}

	return (
		<>
			<h2 className={styles['collaborators-list__title']}>
				Сотрудники подразделения "{subdivisionName}"
			</h2>
			{collaborators.map((collaborator) => (
				<CollaboratorCard
					key={collaborator.id}
					{...collaborator}
				/>
			))}
		</>
	);
};

