import axios from 'axios';

const getBackendUrl = () => {
	const baseServerPath = window?._app?.baseServerPath || 'http://localhost:80';
	// Используем object_code вместо object_id для соответствия URL из браузера
	return `${baseServerPath}/custom_web_template.html?object_code=adapt_ass`;
};

export interface IReportRow {
	PrimaryKey?: string;
	code?: string;
	name?: string;
	startDate?: string;
	endDate?: string;
	personName?: string;
	workflowStateName?: string;
	expertName?: string;
	res?: string;
}

export interface IReportResponse {
	success: boolean;
	error: boolean;
	data: IReportRow[];
}

export const getAssessmentReport = async (): Promise<IReportRow[]> => {
	try {
		const { data } = await axios.post<IReportResponse>(
			getBackendUrl(),
			{
				method: 'getAssessmentReport',
			},
			{
				headers: {
					'Content-Type': 'application/json',
				},
			},
		);

		if (!data.success || data.error) {
			const errorMessage =
				typeof data.data === 'object' && data.data !== null && 'message' in data.data
					? String((data.data as { message: string }).message)
					: 'Ошибка при получении данных отчета';
			throw new Error(errorMessage);
		}

		if (!Array.isArray(data.data)) {
			throw new Error('Неверный формат данных от сервера');
		}

		return data.data;
	} catch (error) {
		if (axios.isAxiosError(error)) {
			console.error('Ошибка сети при выполнении запроса getAssessmentReport: ', error);
			if (error.response) {
				console.error('Ответ сервера:', error.response.data);
				throw new Error(
					`Ошибка сервера: ${error.response.status} - ${
						error.response.data?.message || error.message
					}`,
				);
			} else if (error.request) {
				throw new Error('Не удалось подключиться к серверу');
			}
		}
		console.error('Ошибка при выполнении запроса getAssessmentReport: ', error);
		throw error;
	}
};
