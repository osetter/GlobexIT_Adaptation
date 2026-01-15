import { useState, useMemo } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Tabs } from 'antd';
import { Search } from '@shared/components/Search/Search';
import { SubdivisionFilter } from '@shared/components/SubdivisionFilter/SubdivisionFilter';
import { Subdivision } from '@shared/types/wt-objects/subdivision';
import { Collaborator } from '@shared/types/wt-objects/collaborator';
import { useSubdivisionsHierarchy } from '@shared/hooks/useSubdivisionsHierarchy';
import { useCollaborators } from '@shared/hooks/useCollaborators';
import { useCollaboratorsExcludingTeam } from '@shared/hooks/useCollaboratorsExcludingTeam';
import { useCollaboratorFilter } from '@shared/hooks/useCollaboratorFilter';
import { useCollaboratorDetails } from '@shared/hooks/useCollaboratorDetails';
import { useTeam } from '@shared/hooks/useTeam';
import { useTeamMembers } from '@shared/hooks/useTeamMembers';
import { filterCollaboratorsBySubdivisions } from '@shared/utils/filterCollaboratorsBySubdivisions';
import { SubdivisionsList } from './components/SubdivisionsList/SubdivisionsList';
import { CollaboratorsList } from './components/CollaboratorsList/CollaboratorsList';
import { AllCollaboratorsList } from './components/AllCollaboratorsList/AllCollaboratorsList';
import { TeamList } from './components/TeamList/TeamList';
import { CollaboratorDetailsModal } from './components/CollaboratorDetailsModal/CollaboratorDetailsModal';
import styles from './Home.module.scss';

const getTabFromPath = (pathname: string): string => {
	// Проверяем путь /colls/:tab
	const pathParts = pathname.split('/').filter(Boolean);
	const lastPart = pathParts[pathParts.length - 1];

	if (
		lastPart === 'team' ||
		lastPart === 'collaborators' ||
		lastPart === 'subdivisions'
	) {
		return lastPart;
	}

	return 'subdivisions';
};

export const Home = () => {
	const navigate = useNavigate();
	const location = useLocation();
	const activeTab = useMemo(
		() => getTabFromPath(location.pathname),
		[location.pathname],
	);
	const [selectedCollaborator, setSelectedCollaborator] =
		useState<Collaborator | null>(null);
	const [selectedSubdivision, setSelectedSubdivision] =
		useState<Subdivision | null>(null);
	const [selectedSubdivisionIds, setSelectedSubdivisionIds] = useState<
		number[]
	>([]);
	const [searchQuery, setSearchQuery] = useState('');

	// Иерархия подразделений
	const {
		subdivisionTree,
		subdivisions,
		loading: loadingSubdivisions,
	} = useSubdivisionsHierarchy();
	const {
		collaborators,
		loading: loadingCollaborators,
		loadCollaborators,
	} = useCollaborators();

	// Сотрудники
	const {
		collaborators: collaboratorsExcludingTeam,
		loading: loadingCollaboratorsExcludingTeam,
		reload: reloadCollaboratorsExcludingTeam,
	} = useCollaboratorsExcludingTeam();
	const {
		searchQuery: collaboratorSearchQuery,
		setSearchQuery: setCollaboratorSearchQuery,
		filteredCollaborators: filteredCollaboratorsBySearch,
	} = useCollaboratorFilter(collaboratorsExcludingTeam);

	// Команда
	const {
		teamMembers,
		subscriptions,
		loading: loadingTeamMembers,
		reload: reloadTeamMembers,
		removeMember,
	} = useTeamMembers();
	const {
		searchQuery: teamSearchQuery,
		setSearchQuery: setTeamSearchQuery,
		filteredCollaborators: filteredTeamMembersBySearch,
	} = useCollaboratorFilter(teamMembers);

	// Детали сотрудника
	const {
		details,
		loading: loadingDetails,
		loadDetails,
		clearDetails,
	} = useCollaboratorDetails();

	// Управление командой
	const {
		addCollaboratorToTeam,
		removeCollaboratorFromTeam,
		loading: teamActionLoading,
	} = useTeam();

	const handleTabChange = (key: string) => {
		const currentPath = location.pathname.includes(
			'/custom_web_template.html',
		)
			? '/custom_web_template.html'
			: '/colls';

		// Используем путь вместо query параметра
		const newUrl = `${currentPath}/${key}`;
		navigate(newUrl);
	};

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

	const handleAddToTeam = async (collaboratorId: number) => {
		const success = await addCollaboratorToTeam(collaboratorId);
		if (success) {
			reloadCollaboratorsExcludingTeam();
			reloadTeamMembers();
		}
	};

	const handleRemoveFromTeam = async (subscriptionId: number) => {
		const success = await removeCollaboratorFromTeam(subscriptionId);
		if (success) {
			removeMember(subscriptionId);
			reloadCollaboratorsExcludingTeam();
		}
	};

	// Фильтрация сотрудников по подразделениям
	const filteredCollaborators = useMemo(() => {
		let filtered = filteredCollaboratorsBySearch;
		if (selectedSubdivisionIds.length > 0) {
			filtered = filterCollaboratorsBySubdivisions(
				filtered,
				selectedSubdivisionIds,
			);
		}
		return filtered;
	}, [filteredCollaboratorsBySearch, selectedSubdivisionIds]);

	const filteredTeamMembers = useMemo(() => {
		let filtered = filteredTeamMembersBySearch;
		if (selectedSubdivisionIds.length > 0) {
			filtered = filterCollaboratorsBySubdivisions(
				filtered,
				selectedSubdivisionIds,
			);
		}
		return filtered;
	}, [filteredTeamMembersBySearch, selectedSubdivisionIds]);

	const subdivisionsTabContent = (
		<div className={styles['home-page__content']}>
			<div className={styles['home-page__subdivisions']}>
				<h2 className={styles['home-page__subdivisions-title']}>
					Подразделения
				</h2>
				<SubdivisionsList
					subdivisionTree={subdivisionTree}
					loading={loadingSubdivisions}
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
			<div className={styles['home-page__filters']}>
				<SubdivisionFilter
					subdivisions={subdivisions}
					selectedSubdivisionIds={selectedSubdivisionIds}
					onChange={setSelectedSubdivisionIds}
					placeholder="Фильтр по подразделениям"
				/>
			</div>
			<AllCollaboratorsList
				collaborators={filteredCollaborators}
				loading={loadingCollaboratorsExcludingTeam}
				searchQuery={collaboratorSearchQuery}
				onCollaboratorClick={handleCollaboratorClick}
				onAddToTeam={handleAddToTeam}
				addingToTeam={teamActionLoading}
			/>
		</div>
	);

	const teamTabContent = (
		<div className={styles['home-page__team-tab']}>
			<div className={styles['home-page__filters']}>
				<SubdivisionFilter
					subdivisions={subdivisions}
					selectedSubdivisionIds={selectedSubdivisionIds}
					onChange={setSelectedSubdivisionIds}
					placeholder="Фильтр по подразделениям"
				/>
			</div>
			<TeamList
				teamMembers={filteredTeamMembers}
				subscriptions={subscriptions.map((sub) => ({
					id: sub.subscription_id,
					person_id: sub.person_id,
				}))}
				loading={loadingTeamMembers}
				searchQuery={teamSearchQuery}
				onCollaboratorClick={handleCollaboratorClick}
				onRemoveFromTeam={handleRemoveFromTeam}
				removingFromTeam={teamActionLoading}
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
		{
			key: 'team',
			label: 'Команда',
			children: teamTabContent,
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
					<>
						<Search
							value={collaboratorSearchQuery}
							onChange={setCollaboratorSearchQuery}
							placeholder="Поиск сотрудников..."
						/>
					</>
				)}
				{activeTab === 'team' && (
					<Search
						value={teamSearchQuery}
						onChange={setTeamSearchQuery}
						placeholder="Поиск сотрудников..."
					/>
				)}
				<Tabs
					activeKey={activeTab}
					onChange={handleTabChange}
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
