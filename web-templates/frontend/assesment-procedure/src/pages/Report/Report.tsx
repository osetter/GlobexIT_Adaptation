import React, { useEffect, useState } from 'react';
import { getAssessmentReport, IReportRow } from '../../api/api';
import styles from './Report.module.scss';

interface GroupedData {
	personName: string;
	procedures: {
		procedureName: string;
		rows: IReportRow[];
	}[];
}

export const Report: React.FC = () => {
	const [data, setData] = useState<IReportRow[]>([]);
	const [groupedData, setGroupedData] = useState<GroupedData[]>([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		const fetchData = async () => {
			try {
				setLoading(true);
				const reportData = await getAssessmentReport();
				setData(reportData);
			} catch (err) {
				setError(err instanceof Error ? err.message : 'Ошибка загрузки данных');
			} finally {
				setLoading(false);
			}
		};

		fetchData();
	}, []);

	useEffect(() => {
		if (data.length === 0) return;

		// Группировка данных
		const grouped: { [key: string]: GroupedData } = {};

		data.forEach((row) => {
			const personName = row.personName || 'Не указано';
			const procedureName = row.name || 'Не указано';

			if (!grouped[personName]) {
				grouped[personName] = {
					personName,
					procedures: [],
				};
			}

			let procedureGroup = grouped[personName].procedures.find(
				(p) => p.procedureName === procedureName,
			);

			if (!procedureGroup) {
				procedureGroup = {
					procedureName,
					rows: [],
				};
				grouped[personName].procedures.push(procedureGroup);
			}

			procedureGroup.rows.push(row);
		});

		// Сортировка: ФИО оцениваемых по алфавиту
		const sorted = Object.values(grouped).sort((a, b) =>
			a.personName.localeCompare(b.personName, 'ru'),
		);

		setGroupedData(sorted);
	}, [data]);

	const formatDate = (dateStr?: string): string => {
		if (!dateStr || dateStr.trim() === '') return '-';
		try {
			// Если дата уже отформатирована (строка вида "01.01.2025"), возвращаем как есть
			if (dateStr.match(/^\d{2}\.\d{2}\.\d{4}$/)) {
				return dateStr;
			}
			const date = new Date(dateStr);
			if (isNaN(date.getTime())) {
				return dateStr;
			}
			return date.toLocaleDateString('ru-RU', {
				day: '2-digit',
				month: '2-digit',
				year: 'numeric',
			});
		} catch {
			return dateStr;
		}
	};

	if (loading) {
		return (
			<div className={styles.container}>
				<div className={styles.loading}>Загрузка данных...</div>
			</div>
		);
	}

	if (error) {
		return (
			<div className={styles.container}>
				<div className={styles.error}>
					<h2>Ошибка загрузки данных</h2>
					<p>{error}</p>
					<button
						onClick={() => {
							setError(null);
							setLoading(true);
							getAssessmentReport()
								.then((data) => {
									setData(data);
								})
								.catch((err) => {
									setError(err instanceof Error ? err.message : 'Ошибка загрузки данных');
								})
								.finally(() => {
									setLoading(false);
								});
						}}
					>
						Повторить попытку
					</button>
				</div>
			</div>
		);
	}

	if (groupedData.length === 0) {
		return (
			<div className={styles.container}>
				<div className={styles.empty}>Нет данных для отображения</div>
			</div>
		);
	}

	return (
		<div className={styles.container}>
			<h1 className={styles.title}>Отчет по результатам оценки</h1>
			<div className={styles.report}>
				{groupedData.map((personGroup, personIndex) => (
					<div key={personIndex} className={styles.personGroup}>
						<h2 className={styles.personName}>
							Оцениваемый: {personGroup.personName}
						</h2>
						{personGroup.procedures.map((procedure, procIndex) => (
							<div key={procIndex} className={styles.procedureGroup}>
								<h3 className={styles.procedureName}>
									Процедура оценки: {procedure.procedureName || 'Не указано'}
								</h3>
								<table className={styles.table}>
									<thead>
										<tr>
											<th>Дата начала</th>
											<th>Дата завершения</th>
											<th>Текущий этап ДО</th>
											<th>ФИО оценивающего</th>
											<th>Оценка</th>
										</tr>
									</thead>
									<tbody>
										{procedure.rows.map((row, rowIndex) => (
											<tr key={rowIndex}>
												<td>{formatDate(row.startDate)}</td>
												<td>{formatDate(row.endDate)}</td>
												<td>{row.workflowStateName || '-'}</td>
												<td>{row.expertName || '-'}</td>
												<td>{row.res || '-'}</td>
											</tr>
										))}
									</tbody>
								</table>
							</div>
						))}
					</div>
				))}
			</div>
		</div>
	);
};
