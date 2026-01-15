import { Card } from 'antd';
import { Collaborator } from '@shared/types/wt-objects/collaborator';
import styles from './CollaboratorCard.module.scss';

interface CollaboratorCardProps extends Collaborator {
	onClick?: () => void;
}

export const CollaboratorCard = ({
	id,
	fullname,
	onClick,
}: CollaboratorCardProps) => {
	return (
		<Card
			className={styles['collaborator-card']}
			onClick={onClick}
			style={onClick ? { cursor: 'pointer' } : undefined}
		>
			<p className={styles['collaborator-card__name']}>{fullname}</p>
			<p className={styles['collaborator-card__id']}>ID: {id}</p>
		</Card>
	);
};
