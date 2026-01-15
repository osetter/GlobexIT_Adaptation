import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import '@app/styles/index.scss';
import '@app/styles/normalize-wt.scss';
import { Home } from '@pages/Home/Home';

ReactDOM.createRoot(document.getElementById('root')!).render(
	<React.StrictMode>
		<BrowserRouter>
			<Routes>
				<Route path="/custom_web_template.html" element={<Home />} />
				<Route path="/colls" element={<Home />} />
				<Route path="/colls/:tab" element={<Home />} />
				<Route path="*" element={<Home />} />
			</Routes>
		</BrowserRouter>
	</React.StrictMode>,
);
