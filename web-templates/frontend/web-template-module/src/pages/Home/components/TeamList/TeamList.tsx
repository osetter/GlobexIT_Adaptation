import { Spin, Button, Tooltip } from 'antd';
import { UserDeleteOutlined } from '@ant-design/icons';
import { Collaborator } from '@shared/types/wt-objects/collaborator';
import { CollaboratorCard } from '@shared/components/CollaboratorCard/CollaboratorCard';
import styles from './TeamList.module.scss';

interface TeamListProps {
	teamMembers: Collaborator[];
	subscriptions: Array<{ id: number; person_id: number }>;
	loading: boolean;
	searchQuery: string;
	onCollaboratorClick: (collaborator: Collaborator) => void;
	onRemoveFromTeam: (subscriptionId: number) => void;
	removingFromTeam?: boolean;
}

export const TeamList = ({
	teamMembers,
	subscriptions,
	loading,
	searchQuery,
	onCollaboratorClick,
	onRemoveFromTeam,
	removingFromTeam = false,
}: TeamListProps) => {
	const getSubscriptionId = (collaboratorId: number): number | undefined => {
		const subscription = subscriptions.find(
			(sub) => sub.person_id === collaboratorId,
		);
		return subscription?.id;
	};

	if (loading) {
		return (
			<div className={styles['team-list__loader']}>
				<Spin size="large" />
			</div>
		);
	}

	if (teamMembers.length === 0) {
		return (
			<div className={styles['team-list__empty']}>
				{searchQuery
					? 'Сотрудники не найдены'
					: 'В команде пока нет сотрудников'}
			</div>
		);
	}

	return (
		<div className={styles['team-list']}>
			{teamMembers.map((collaborator) => {
				const subscriptionId = getSubscriptionId(collaborator.id);
				return (
					<div
						key={collaborator.id}
						className={styles['team-list__item']}
					>
						<CollaboratorCard
							id={collaborator.id}
							fullname={collaborator.fullname}
							onClick={() => onCollaboratorClick(collaborator)}
						/>
						{subscriptionId && (
							<Tooltip title="Удалить из команды">
								<Button
									danger
									icon={<UserDeleteOutlined />}
									onClick={() =>
										onRemoveFromTeam(subscriptionId)
									}
									loading={removingFromTeam}
									className={styles['team-list__action']}
								>
									Удалить из команды
								</Button>
							</Tooltip>
						)}
					</div>
				);
			})}
		</div>
	);
};
