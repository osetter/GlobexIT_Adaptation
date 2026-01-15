import { Collaborator } from '@shared/types/wt-objects/collaborator';

export const filterCollaboratorsBySubdivisions = (
	collaborators: Collaborator[],
	subdivisionIds: number[],
): Collaborator[] => {
	if (subdivisionIds.length === 0) {
		return collaborators;
	}

	return collaborators.filter((collaborator) => {
		return (
			collaborator.position_parent_id !== undefined &&
			subdivisionIds.includes(collaborator.position_parent_id)
		);
	});
};
