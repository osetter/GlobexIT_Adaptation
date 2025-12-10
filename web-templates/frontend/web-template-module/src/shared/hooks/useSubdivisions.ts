import { useState, useEffect } from 'react';
import { message } from 'antd';
import { getSubdivisions } from '@api/api';
import { Subdivision } from '@shared/types/wt-objects/subdivision';

export const useSubdivisions = () => {
	const [subdivisions, setSubdivisions] = useState<Subdivision[]>([]);
	const [loading, setLoading] = useState(false);

	const loadSubdivisions = async () => {
		setLoading(true);
		try {
			const response = await getSubdivisions();
			if (response?.success && response?.data) {
				setSubdivisions(response.data);
			} else if (response?.error) {
				message.error(
					response.message ||
						'Произошла ошибка при загрузке подразделений',
				);
			}
		} catch (error) {
			message.error(
				'Ошибка на стороне сервера при загрузке подразделений',
			);
			console.error('Ошибка при загрузке подразделений:', error);
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		loadSubdivisions();
	}, []);

	return { subdivisions, loading, reload: loadSubdivisions };
};

