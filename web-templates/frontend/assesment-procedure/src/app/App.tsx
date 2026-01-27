import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Report } from '../pages/Report/Report';
import './styles/index.scss';

ReactDOM.createRoot(document.getElementById('root')!).render(
	<React.StrictMode>
		<BrowserRouter>
			<Routes>
				<Route path="/assessment-report.html" element={<Report />} />
				<Route path="*" element={<Report />} />
			</Routes>
		</BrowserRouter>
	</React.StrictMode>,
);
