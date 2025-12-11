import { useState, useMemo } from 'react';
import { Collaborator } from '@shared/types/wt-objects/collaborator';

export const useCollaboratorFilter = (collaborators: Collaborator[]) => {
	const [searchQuery, setSearchQuery] = useState('');

	const filteredCollaborators = useMemo(() => {
		if (!searchQuery.trim()) {
			return collaborators;
		}
		return collaborators.filter((collaborator) =>
			collaborator.fullname
				?.toLowerCase()
				.includes(searchQuery.toLowerCase()),
		);
	}, [searchQuery, collaborators]);

	return { searchQuery, setSearchQuery, filteredCollaborators };
};
