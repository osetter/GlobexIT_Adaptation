import { Select } from 'antd';
import { Subdivision } from '@shared/types/wt-objects/subdivision';
import styles from './SubdivisionFilter.module.scss';

interface SubdivisionFilterProps {
	subdivisions: Subdivision[];
	selectedSubdivisionIds: number[];
	onChange: (subdivisionIds: number[]) => void;
	placeholder?: string;
}

export const SubdivisionFilter = ({
	subdivisions,
	selectedSubdivisionIds,
	onChange,
	placeholder = 'Выберите подразделения',
}: SubdivisionFilterProps) => {
	const options = subdivisions.map((subdivision) => ({
		label: subdivision.name,
		value: subdivision.id,
	}));

	return (
		<Select
			mode="multiple"
			placeholder={placeholder}
			value={selectedSubdivisionIds}
			onChange={onChange}
			options={options}
			className={styles['subdivision-filter']}
			allowClear
			maxTagCount="responsive"
		/>
	);
};
