import { Subdivision } from '@shared/types/wt-objects/subdivision';

export const buildSubdivisionTree = (
	subdivisions: Subdivision[],
): Subdivision[] => {
	const subdivisionMap = new Map<number, Subdivision>();
	const rootSubdivisions: Subdivision[] = [];

	subdivisions.forEach((subdivision) => {
		subdivisionMap.set(subdivision.id, { ...subdivision, children: [] });
	});

	subdivisions.forEach((subdivision) => {
		const node = subdivisionMap.get(subdivision.id);
		if (!node) return;

		if (
			subdivision.parent_object_id &&
			subdivisionMap.has(subdivision.parent_object_id)
		) {
			const parent = subdivisionMap.get(subdivision.parent_object_id);
			if (parent && parent.children) {
				parent.children.push(node);
			}
		} else {
			rootSubdivisions.push(node);
		}
	});

	return rootSubdivisions;
};
