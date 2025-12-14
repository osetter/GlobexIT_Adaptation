import { useState } from 'react';
import { Subdivision } from '@shared/types/wt-objects/subdivision';
import styles from './SubdivisionTree.module.scss';

interface SubdivisionTreeProps {
	subdivisions: Subdivision[];
	loading: boolean;
	selectedSubdivisionId?: number;
	onSubdivisionClick: (subdivision: Subdivision) => void;
}

const renderSubdivision = (
	subdivision: Subdivision,
	onClick: (subdivision: Subdivision) => void,
	selectedId: number | undefined,
	expandedKeys: Set<number>,
	toggleExpand: (id: number) => void,
	level: number = 0,
): React.ReactElement => {
	const isSelected = selectedId === subdivision.id;
	const hasChildren = subdivision.children && subdivision.children.length > 0;
	const isExpanded = expandedKeys.has(subdivision.id);
	const indent = level * 16;

	const handleClick = (e: React.MouseEvent) => {
		e.stopPropagation();
		if (hasChildren) {
			toggleExpand(subdivision.id);
		}
		onClick(subdivision);
	};

	return (
		<div key={subdivision.id}>
			<div
				className={
					isSelected
						? styles['tree-node--selected']
						: styles['tree-node']
				}
				style={{ paddingLeft: `${indent}px` }}
				onClick={handleClick}
			>
				{hasChildren && (
					<span className={styles['tree-node-icon']}>
						{isExpanded ? '▼' : '▶'}
					</span>
				)}
				{!hasChildren && (
					<span className={styles['tree-node-icon-empty']}></span>
				)}
				<span className={styles['tree-node-text']}>
					{subdivision.name}
				</span>
			</div>
			{hasChildren && isExpanded && (
				<div className={styles['tree-node-children']}>
					{subdivision.children?.map((child) =>
						renderSubdivision(
							child,
							onClick,
							selectedId,
							expandedKeys,
							toggleExpand,
							level + 1,
						),
					)}
				</div>
			)}
		</div>
	);
};

export const SubdivisionTree = ({
	subdivisions,
	loading,
	selectedSubdivisionId,
	onSubdivisionClick,
}: SubdivisionTreeProps) => {
	const [expandedKeys, setExpandedKeys] = useState<Set<number>>(new Set());

	const toggleExpand = (id: number) => {
		setExpandedKeys((prev) => {
			const newSet = new Set(prev);
			if (newSet.has(id)) {
				newSet.delete(id);
			} else {
				newSet.add(id);
			}
			return newSet;
		});
	};

	if (loading) {
		return <div className={styles['tree-loader']}>Загрузка...</div>;
	}

	if (subdivisions.length === 0) {
		return (
			<div className={styles['tree-empty']}>
				Нет доступных подразделений
			</div>
		);
	}

	return (
		<div className={styles['subdivision-tree']}>
			{subdivisions.map((subdivision) =>
				renderSubdivision(
					subdivision,
					onSubdivisionClick,
					selectedSubdivisionId,
					expandedKeys,
					toggleExpand,
					0,
				),
			)}
		</div>
	);
};
