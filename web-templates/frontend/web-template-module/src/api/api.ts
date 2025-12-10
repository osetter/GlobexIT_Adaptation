import axios from 'axios';
import { BACKEND_URL } from '@app/config/templateVars';

export const getSubdivisions = async () => {
	try {
		const { data } = await axios.post(BACKEND_URL, {
			method: 'getSubdivisions',
		});

		return data;
	} catch (error) {
		console.error('Ошибка при выполнении запроса getSubdivisions: ', error);
		throw error;
	}
};

export const getCollaborators = async (subdivisionId: number) => {
	try {
		const { data } = await axios.post(BACKEND_URL, {
			method: 'getCollaborators',
			subdivisionId: subdivisionId,
		});

		return data;
	} catch (error) {
		console.error(
			'Ошибка при выполнении запроса getCollaborators: ',
			error,
		);
		throw error;
	}
};
