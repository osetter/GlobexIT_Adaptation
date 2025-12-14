export interface Subdivision {
	id: number;
	name: string;
	parent_object_id?: number;
	children?: Subdivision[];
}
