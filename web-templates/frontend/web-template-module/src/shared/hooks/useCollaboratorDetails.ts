import { useState } from 'react';
import { message } from 'antd';
import { getCollaboratorDetails } from '@api/api';
import { Collaborator } from '@shared/types/wt-objects/collaborator';

export const useCollaboratorDetails = () => {
	const [details, setDetails] = useState<Collaborator[] | null>(null);
	const [loading, setLoading] = useState(false);

	const loadDetails = async (collaboratorId: number) => {
		setLoading(true);
		setDetails(null);

		try {
			const response = await getCollaboratorDetails(collaboratorId);
			if (response?.success && response?.data) {
				setDetails(response.data);
			} else if (response?.error) {
				message.error(
					response.message ||
						'Произошла ошибка при загрузке деталей сотрудника',
				);
			}
		} catch (error) {
			message.error(
				'Ошибка на стороне сервера при загрузке деталей сотрудника',
			);
			console.error('Ошибка при загрузке деталей сотрудника:', error);
		} finally {
			setLoading(false);
		}
	};

	const clearDetails = () => {
		setDetails(null);
	};

	return { details, loading, loadDetails, clearDetails };
};
