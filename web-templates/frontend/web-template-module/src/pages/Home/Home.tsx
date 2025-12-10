import { useState } from 'react';
import { Search } from '@shared/components/Search/Search';
import { Subdivision } from '@shared/types/wt-objects/subdivision';
import { useSubdivisions } from '@shared/hooks/useSubdivisions';
import { useCollaborators } from '@shared/hooks/useCollaborators';
import { useSubdivisionFilter } from '@shared/hooks/useSubdivisionFilter';
import { SubdivisionsList } from './components/SubdivisionsList/SubdivisionsList';
import { CollaboratorsList } from './components/CollaboratorsList/CollaboratorsList';
import styles from './Home.module.scss';

export const Home = () => {
	const { subdivisions, loading } = useSubdivisions();
	const { searchQuery, setSearchQuery, filteredSubdivisions } =
		useSubdivisionFilter(subdivisions);
	const [selectedSubdivision, setSelectedSubdivision] =
		useState<Subdivision | null>(null);
	const { collaborators, loading: loadingCollaborators, loadCollaborators } =
		useCollaborators();

	const handleSubdivisionClick = (subdivision: Subdivision) => {
		setSelectedSubdivision(subdivision);
		loadCollaborators(subdivision.id);
	};

	return (
		<section className={styles['home-page']}>
			<div className={styles['home-page__container']}>
				<Search value={searchQuery} onChange={setSearchQuery} />
				<div className={styles['home-page__content']}>
					<div className={styles['home-page__subdivisions']}>
						<h2 className={styles['home-page__subdivisions-title']}>
							Подразделения
						</h2>
						<SubdivisionsList
							subdivisions={filteredSubdivisions}
							loading={loading}
							searchQuery={searchQuery}
							selectedSubdivisionId={selectedSubdivision?.id}
							onSubdivisionClick={handleSubdivisionClick}
						/>
					</div>

					{selectedSubdivision && (
						<div className={styles['home-page__collaborators']}>
							<CollaboratorsList
								collaborators={collaborators}
								loading={loadingCollaborators}
								subdivisionName={selectedSubdivision.name}
							/>
						</div>
					)}
				</div>
			</div>
		</section>
	);
};
