declare global {
	interface Window {
		_app: {
			backendId: string;
			baseServerPath: string;
		};
	}
}

// Для локального тестирования без подключения к WEBSOFT'у
export const backendId = window._app?.backendId ?? '7230343225362207292';
export const baseServerPath =
	window?._app?.baseServerPath || 'http://localhost:80';
export const BACKEND_URL = `${baseServerPath}/custom_web_template.html?object_id=${backendId}`;
