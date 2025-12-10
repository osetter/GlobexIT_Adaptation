export function getParam(name: string, defaultVal: string = "undefined") {
	return tools_web.get_web_param(curParams, name, defaultVal, true, "");
}