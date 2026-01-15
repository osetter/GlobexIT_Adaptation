import { Card } from 'antd';
import { Subdivision } from '@shared/types/wt-objects/subdivision';
import styles from './SubdivisionCard.module.scss';

interface SubdivisionCardProps extends Subdivision {
	onClick?: () => void;
	isSelected?: boolean;
}

export const SubdivisionCard = ({
	id,
	name,
	onClick,
	isSelected,
}: SubdivisionCardProps) => {
	return (
		<Card
			className={`${styles['subdivision-card']} ${
				isSelected ? styles['subdivision-card--selected'] : ''
			}`}
			hoverable
			onClick={onClick}
		>
			<h3 className={styles['subdivision-card__name']}>{name}</h3>
			<p className={styles['subdivision-card__id']}>ID: {id}</p>
		</Card>
	);
};
