import React from 'react';
import ReactDOM from 'react-dom/client';
import '@app/styles/index.scss';
import '@app/styles/normalize-wt.scss';
import { Home } from '@pages/Home/Home';

ReactDOM.createRoot(document.getElementById('root')!).render(
	<React.StrictMode>
		<Home />
	</React.StrictMode>,
);
