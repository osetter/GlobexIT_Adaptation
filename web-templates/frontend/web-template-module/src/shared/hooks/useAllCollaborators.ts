import { useState, useEffect } from 'react';
import { message } from 'antd';
import { getAllCollaboratorsList } from '@api/api';
import { Collaborator } from '@shared/types/wt-objects/collaborator';

export const useAllCollaborators = () => {
	const [collaborators, setCollaborators] = useState<Collaborator[]>([]);
	const [loading, setLoading] = useState(false);

	const loadAllCollaborators = async () => {
		setLoading(true);
		try {
			const response = await getAllCollaboratorsList();
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
		loadAllCollaborators();
	}, []);

	return { collaborators, loading, reload: loadAllCollaborators };
};
