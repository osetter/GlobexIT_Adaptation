declare global {
    interface Window {
        _app: { backendID: string; backendCode: string, appPath: StringConstructor; baseServerPath: string }
    }
}

export const backendCode = window._app?.backendCode ?? 'api_task1_server'
const baseServerPath = window._app?.baseServerPath ?? ""
const normalizedBasePath = baseServerPath.endsWith("/")
    ? baseServerPath.slice(0, -1)
    : baseServerPath

export const BACKEND_URL = `${normalizedBasePath}/custom_web_template.html?object_code=${backendCode}`
