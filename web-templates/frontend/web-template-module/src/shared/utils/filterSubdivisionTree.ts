import { Subdivision } from '@shared/types/wt-objects/subdivision';

const filterTreeRecursive = (
	nodes: Subdivision[],
	query: string,
): Subdivision[] => {
	const filtered: Subdivision[] = [];

	nodes.forEach((node) => {
		const matchesQuery = node.name
			?.toLowerCase()
			.includes(query.toLowerCase());

		const filteredChildren = node.children
			? filterTreeRecursive(node.children, query)
			: [];

		if (matchesQuery || filteredChildren.length > 0) {
			filtered.push({
				...node,
				children:
					filteredChildren.length > 0
						? filteredChildren
						: node.children,
			});
		}
	});

	return filtered;
};

export const filterSubdivisionTree = (
	tree: Subdivision[],
	query: string,
): Subdivision[] => {
	if (!query.trim()) {
		return tree;
	}

	return filterTreeRecursive(tree, query);
};
