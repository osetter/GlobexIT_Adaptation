import { useState, useMemo } from 'react';
import { Subdivision } from '@shared/types/wt-objects/subdivision';
import { processSubdivisions } from '@shared/utils/processSubdivisions';

export const useSubdivisionFilter = (subdivisions: Subdivision[]) => {
	const [searchQuery, setSearchQuery] = useState('');

	const filteredSubdivisions = useMemo(() => {
		if (!searchQuery.trim()) {
			return subdivisions;
		}
		return processSubdivisions(subdivisions, searchQuery);
	}, [searchQuery, subdivisions]);

	return { searchQuery, setSearchQuery, filteredSubdivisions };
};
