const DEV_MODE = tools_web.is_true(customWebTemplate.access.enable_anonymous_access)

if (DEV_MODE) {
	// Для тестирования, шаблон должен быть анонимным.
	Request.AddRespHeader("Access-Control-Allow-Origin", "*", false);
	Request.AddRespHeader("Access-Control-Expose-Headers", "Error-Message");
	Request.AddRespHeader("Access-Control-Allow-Headers", "origin, content-type, accept");
	Request.AddRespHeader("Access-Control-Allow-Credentials", "true");
}

Request.RespContentType = "application/json";
Request.AddRespHeader("Content-Security-Policy", "frame-ancestors 'self'");
Request.AddRespHeader("X-XSS-Protection", "1");
Request.AddRespHeader("X-Frame-Options", "SAMEORIGIN");
