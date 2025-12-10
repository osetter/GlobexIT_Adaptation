import { Spin } from 'antd';
import { SubdivisionCard } from '@shared/components/SubdivisionCard/SubdivisionCard';
import { Subdivision } from '@shared/types/wt-objects/subdivision';
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
			<p className={styles['subdivisions-list__empty']}>
				{searchQuery
					? 'Подразделения не найдены'
					: 'Подразделения отсутствуют'}
			</p>
		);
	}

	return (
		<>
			{subdivisions.map((subdivision) => (
				<SubdivisionCard
					key={subdivision.id}
					{...subdivision}
					onClick={() => onSubdivisionClick(subdivision)}
					isSelected={selectedSubdivisionId === subdivision.id}
				/>
			))}
		</>
	);
};

