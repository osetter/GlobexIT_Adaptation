import { Spin } from 'antd';
import { Subdivision } from '@shared/types/wt-objects/subdivision';
import { SubdivisionCard } from '@shared/components/SubdivisionCard/SubdivisionCard';
import styles from './SubdivisionsList.module.scss';

interface SubdivisionsListProps {
	subdivisions: Subdivision[];
	loading: boolean;
	searchQuery: string;
	selectedSubdivisionId?: number;
	onSubdivisionClick: (subdivision: Subdivision) => void;
}

export const SubdivisionsList = ({
	subdivisions,
	loading,
	searchQuery,
	selectedSubdivisionId,
	onSubdivisionClick,
}: SubdivisionsListProps) => {
	if (loading) {
		return (
			<div className={styles['subdivisions-list__loader']}>
				<Spin size="large" />
			</div>
		);
	}

	if (subdivisions.length === 0) {
		return (
			<div className={styles['subdivisions-list__empty']}>
				{searchQuery
					? 'Подразделения не найдены'
					: 'Нет доступных подразделений'}
			</div>
		);
	}

	return (
		<div className={styles['subdivisions-list']}>
			{subdivisions.map((subdivision) => (
				<SubdivisionCard
					key={subdivision.id}
					id={subdivision.id}
					name={subdivision.name}
					isSelected={subdivision.id === selectedSubdivisionId}
					onClick={() => onSubdivisionClick(subdivision)}
				/>
			))}
		</div>
	);
};
