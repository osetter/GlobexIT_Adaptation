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

export const getAllCollaboratorsList = async () => {
	try {
		const { data } = await axios.post(BACKEND_URL, {
			method: 'getAllCollaboratorsList',
		});

		return data;
	} catch (error) {
		console.error(
			'Ошибка при выполнении запроса getAllCollaboratorsList: ',
			error,
		);
		throw error;
	}
};

export const getCollaboratorDetails = async (collaboratorId: number) => {
	try {
		const { data } = await axios.post(BACKEND_URL, {
			method: 'getCollaboratorDetails',
			collaboratorId: collaboratorId,
		});

		return data;
	} catch (error) {
		console.error(
			'Ошибка при выполнении запроса getCollaboratorDetails: ',
			error,
		);
		throw error;
	}
};

export const getSubdivisionsHierarchy = async () => {
	try {
		const { data } = await axios.post(BACKEND_URL, {
			method: 'getSubdivisionsHierarchy',
		});

		return data;
	} catch (error) {
		console.error(
			'Ошибка при выполнении запроса getSubdivisionsHierarchy: ',
			error,
		);
		throw error;
	}
};

export const getUserSubscriptions = async () => {
	try {
		const { data } = await axios.post(BACKEND_URL, {
			method: 'getUserSubscriptions',
		});

		return data;
	} catch (error) {
		console.error(
			'Ошибка при выполнении запроса getUserSubscriptions: ',
			error,
		);
		throw error;
	}
};

export const addToTeam = async (collaboratorId: number) => {
	try {
		const { data } = await axios.post(BACKEND_URL, {
			method: 'addToTeam',
			collaboratorId: collaboratorId,
		});

		return data;
	} catch (error) {
		console.error('Ошибка при выполнении запроса addToTeam: ', error);
		throw error;
	}
};

export const removeFromTeam = async (subscriptionId: number) => {
	try {
		const { data } = await axios.post(BACKEND_URL, {
			method: 'removeFromTeam',
			subscriptionId: subscriptionId,
		});

		return data;
	} catch (error) {
		console.error('Ошибка при выполнении запроса removeFromTeam: ', error);
		throw error;
	}
};

export const getCollaboratorsExcludingTeam = async () => {
	try {
		const { data } = await axios.post(BACKEND_URL, {
			method: 'getCollaboratorsExcludingTeam',
		});

		return data;
	} catch (error) {
		console.error(
			'Ошибка при выполнении запроса getCollaboratorsExcludingTeam: ',
			error,
		);
		throw error;
	}
};
