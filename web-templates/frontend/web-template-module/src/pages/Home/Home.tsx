import { useState } from 'react';
import { Tabs } from 'antd';
import { Search } from '@shared/components/Search/Search';
import { Subdivision } from '@shared/types/wt-objects/subdivision';
import { Collaborator } from '@shared/types/wt-objects/collaborator';
import { useSubdivisions } from '@shared/hooks/useSubdivisions';
import { useCollaborators } from '@shared/hooks/useCollaborators';
import { useSubdivisionFilter } from '@shared/hooks/useSubdivisionFilter';
import { useAllCollaborators } from '@shared/hooks/useAllCollaborators';
import { useCollaboratorFilter } from '@shared/hooks/useCollaboratorFilter';
import { useCollaboratorDetails } from '@shared/hooks/useCollaboratorDetails';
import { SubdivisionsList } from './components/SubdivisionsList/SubdivisionsList';
import { CollaboratorsList } from './components/CollaboratorsList/CollaboratorsList';
import { AllCollaboratorsList } from './components/AllCollaboratorsList/AllCollaboratorsList';
import { CollaboratorDetailsModal } from './components/CollaboratorDetailsModal/CollaboratorDetailsModal';
import styles from './Home.module.scss';

export const Home = () => {
	const [activeTab, setActiveTab] = useState('subdivisions');
	const [selectedCollaborator, setSelectedCollaborator] =
		useState<Collaborator | null>(null);

	// Подразделения
	const { subdivisions, loading } = useSubdivisions();
	const { searchQuery, setSearchQuery, filteredSubdivisions } =
		useSubdivisionFilter(subdivisions);
	const [selectedSubdivision, setSelectedSubdivision] =
		useState<Subdivision | null>(null);
	const {
		collaborators,
		loading: loadingCollaborators,
		loadCollaborators,
	} = useCollaborators();

	// Все сотрудники
	const {
		collaborators: allCollaborators,
		loading: loadingAllCollaborators,
	} = useAllCollaborators();
	const {
		searchQuery: collaboratorSearchQuery,
		setSearchQuery: setCollaboratorSearchQuery,
		filteredCollaborators,
	} = useCollaboratorFilter(allCollaborators);

	// Детали сотрудника
	const {
		details,
		loading: loadingDetails,
		loadDetails,
		clearDetails,
	} = useCollaboratorDetails();

	const handleSubdivisionClick = (subdivision: Subdivision) => {
		setSelectedSubdivision(subdivision);
		loadCollaborators(subdivision.id);
	};

	const handleCollaboratorClick = (collaborator: Collaborator) => {
		setSelectedCollaborator(collaborator);
		loadDetails(collaborator.id);
	};

	const handleModalClose = () => {
		setSelectedCollaborator(null);
		clearDetails();
	};

	const subdivisionsTabContent = (
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
	);

	const collaboratorsTabContent = (
		<div className={styles['home-page__collaborators-tab']}>
			<AllCollaboratorsList
				collaborators={filteredCollaborators}
				loading={loadingAllCollaborators}
				searchQuery={collaboratorSearchQuery}
				onCollaboratorClick={handleCollaboratorClick}
			/>
		</div>
	);

	const tabItems = [
		{
			key: 'subdivisions',
			label: 'Подразделения',
			children: subdivisionsTabContent,
		},
		{
			key: 'collaborators',
			label: 'Сотрудники',
			children: collaboratorsTabContent,
		},
	];

	return (
		<section className={styles['home-page']}>
			<div className={styles['home-page__container']}>
				{activeTab === 'subdivisions' && (
					<Search
						value={searchQuery}
						onChange={setSearchQuery}
						placeholder="Поиск подразделений..."
					/>
				)}
				{activeTab === 'collaborators' && (
					<Search
						value={collaboratorSearchQuery}
						onChange={setCollaboratorSearchQuery}
						placeholder="Поиск сотрудников..."
					/>
				)}
				<Tabs
					activeKey={activeTab}
					onChange={setActiveTab}
					items={tabItems}
					className={styles['home-page__tabs']}
				/>
			</div>
			<CollaboratorDetailsModal
				open={selectedCollaborator !== null}
				onClose={handleModalClose}
				collaborator={selectedCollaborator}
				details={details}
				loading={loadingDetails}
			/>
		</section>
	);
};
