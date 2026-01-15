export interface ISubdivision {
	id: XmlElem<number>;
	name: XmlElem<string>;
	parent_object_id?: XmlElem<number>;
}