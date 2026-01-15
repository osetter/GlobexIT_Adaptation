import { Subdivision } from '@shared/types/wt-objects/subdivision';
import { SubdivisionTree } from '@shared/components/SubdivisionTree/SubdivisionTree';
import { filterSubdivisionTree } from '@shared/utils/filterSubdivisionTree';
import styles from './SubdivisionsList.module.scss';

interface SubdivisionsListProps {
	subdivisionTree: Subdivision[];
	loading: boolean;
	searchQuery: string;
	selectedSubdivisionId?: number;
	onSubdivisionClick: (subdivision: Subdivision) => void;
}

export const SubdivisionsList = ({
	subdivisionTree,
	loading,
	searchQuery,
	selectedSubdivisionId,
	onSubdivisionClick,
}: SubdivisionsListProps) => {
	const filteredTree = filterSubdivisionTree(subdivisionTree, searchQuery);

	return (
		<div className={styles['subdivisions-list']}>
			<SubdivisionTree
				subdivisions={filteredTree}
				loading={loading}
				selectedSubdivisionId={selectedSubdivisionId}
				onSubdivisionClick={onSubdivisionClick}
			/>
		</div>
	);
};
