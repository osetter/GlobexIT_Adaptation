import { useState } from 'react';
import { message } from 'antd';
import { addToTeam, removeFromTeam } from '@api/api';

export const useTeam = () => {
	const [loading, setLoading] = useState(false);

	const addCollaboratorToTeam = async (collaboratorId: number) => {
		setLoading(true);
		try {
			const response = await addToTeam(collaboratorId);
			if (response?.success) {
				message.success('Сотрудник успешно добавлен в команду');
				return true;
			} else if (response?.error) {
				message.error(
					response.message ||
						'Произошла ошибка при добавлении в команду',
				);
				return false;
			}
		} catch (error) {
			message.error('Ошибка на стороне сервера при добавлении в команду');
			console.error('Ошибка при добавлении в команду:', error);
			return false;
		} finally {
			setLoading(false);
		}
		return false;
	};

	const removeCollaboratorFromTeam = async (subscriptionId: number) => {
		setLoading(true);
		try {
			const response = await removeFromTeam(subscriptionId);
			if (response?.success) {
				message.success('Сотрудник успешно удален из команды');
				return true;
			} else if (response?.error) {
				message.error(
					response.message ||
						'Произошла ошибка при удалении из команды',
				);
				return false;
			}
		} catch (error) {
			message.error('Ошибка на стороне сервера при удалении из команды');
			console.error('Ошибка при удалении из команды:', error);
			return false;
		} finally {
			setLoading(false);
		}
		return false;
	};

	return {
		addCollaboratorToTeam,
		removeCollaboratorFromTeam,
		loading,
	};
};
