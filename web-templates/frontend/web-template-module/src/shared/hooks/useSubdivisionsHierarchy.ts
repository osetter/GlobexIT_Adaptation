import { useState, useEffect } from 'react';
import { message } from 'antd';
import { getSubdivisionsHierarchy } from '@api/api';
import { Subdivision } from '@shared/types/wt-objects/subdivision';
import { buildSubdivisionTree } from '@shared/utils/buildSubdivisionTree';

export const useSubdivisionsHierarchy = () => {
	const [subdivisions, setSubdivisions] = useState<Subdivision[]>([]);
	const [subdivisionTree, setSubdivisionTree] = useState<Subdivision[]>([]);
	const [loading, setLoading] = useState(false);

	const loadSubdivisions = async () => {
		setLoading(true);
		try {
			const response = await getSubdivisionsHierarchy();
			if (response?.success && response?.data) {
				setSubdivisions(response.data);
				const tree = buildSubdivisionTree(response.data);
				setSubdivisionTree(tree);
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

	return { subdivisions, subdivisionTree, loading, reload: loadSubdivisions };
};
