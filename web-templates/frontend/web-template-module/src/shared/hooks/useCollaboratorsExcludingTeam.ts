import { useState, useEffect } from 'react';
import { message } from 'antd';
import { getCollaboratorsExcludingTeam } from '@api/api';
import { Collaborator } from '@shared/types/wt-objects/collaborator';

export const useCollaboratorsExcludingTeam = () => {
	const [collaborators, setCollaborators] = useState<Collaborator[]>([]);
	const [loading, setLoading] = useState(false);

	const loadCollaborators = async () => {
		setLoading(true);
		try {
			const response = await getCollaboratorsExcludingTeam();
			if (response?.success && response?.data) {
				setCollaborators(response.data);
			} else if (response?.error) {
				message.error(
					response.message ||
						'Произошла ошибка при загрузке сотрудников',
				);
			}
		} catch (error) {
			message.error('Ошибка на стороне сервера при загрузке сотрудников');
			console.error('Ошибка при загрузке сотрудников:', error);
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		loadCollaborators();
	}, []);

	return { collaborators, loading, reload: loadCollaborators };
};
