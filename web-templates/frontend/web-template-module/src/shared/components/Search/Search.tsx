import { Input } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import styles from './Search.module.scss';

interface SearchProps {
	value: string;
	onChange: (value: string) => void;
	placeholder?: string;
}

export const Search = ({
	value,
	onChange,
	placeholder = 'Поиск подразделений...',
}: SearchProps) => {
	return (
		<Input
			placeholder={placeholder}
			prefix={<SearchOutlined />}
			value={value}
			onChange={(e) => onChange(e.target.value)}
			className={styles.search}
			size="large"
		/>
	);
};
