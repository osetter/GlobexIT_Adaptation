import { useState } from 'react';
import { message } from 'antd';
import { getCollaborators } from '@api/api';
import { Collaborator } from '@shared/types/wt-objects/collaborator';

export const useCollaborators = () => {
	const [collaborators, setCollaborators] = useState<Collaborator[]>([]);
	const [loading, setLoading] = useState(false);

	const loadCollaborators = async (subdivisionId: number) => {
		setLoading(true);
		setCollaborators([]);

		try {
			const response = await getCollaborators(subdivisionId);
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

	return { collaborators, loading, loadCollaborators };
};
