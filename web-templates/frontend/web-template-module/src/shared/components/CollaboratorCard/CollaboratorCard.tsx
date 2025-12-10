import { Card } from 'antd';
import { Collaborator } from '@shared/types/wt-objects/collaborator';
import styles from './CollaboratorCard.module.scss';

export const CollaboratorCard = ({ id, fullname }: Collaborator) => {
	return (
		<Card className={styles['collaborator-card']}>
			<p className={styles['collaborator-card__name']}>{fullname}</p>
			<p className={styles['collaborator-card__id']}>ID: {id}</p>
		</Card>
	);
};
