import { useState, useEffect } from 'react';
import { message } from 'antd';
import { getUserSubscriptions } from '@api/api';
import { Collaborator } from '@shared/types/wt-objects/collaborator';
import { Subscription } from '@shared/types/wt-objects/subscription';

export const useTeamMembers = () => {
	const [teamMembers, setTeamMembers] = useState<Collaborator[]>([]);
	const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
	const [loading, setLoading] = useState(false);

	const loadTeamMembers = async () => {
		setLoading(true);
		try {
			const response = await getUserSubscriptions();
			if (response?.success && response?.data) {
				setSubscriptions(response.data);
				const members: Collaborator[] = response.data.map(
					(subscription: Subscription) => ({
						id: subscription.person_id,
						fullname: subscription.fullname,
						position_parent_id: subscription.position_parent_id,
					}),
				);
				setTeamMembers(members);
			} else if (response?.error) {
				message.error(
					response.message || 'Произошла ошибка при загрузке команды',
				);
			}
		} catch (error) {
			message.error('Ошибка на стороне сервера при загрузке команды');
			console.error('Ошибка при загрузке команды:', error);
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		loadTeamMembers();
	}, []);

	const removeMember = (subscriptionId: number) => {
		setSubscriptions((prev) => {
			const filtered = prev.filter(
				(sub) => sub.subscription_id !== subscriptionId,
			);
			const removedSubscription = prev.find(
				(sub) => sub.subscription_id === subscriptionId,
			);
			if (removedSubscription) {
				setTeamMembers((currentMembers) =>
					currentMembers.filter(
						(member) => member.id !== removedSubscription.person_id,
					),
				);
			}
			return filtered;
		});
	};

	return {
		teamMembers,
		subscriptions,
		loading,
		reload: loadTeamMembers,
		removeMember,
	};
};
