function fetchUsers() {
	try {
		const response = HttpRequest("https://jsonplaceholder.typicode.com/users", "get", null, "")

		if (response.RespCode !== 200) {
			throw Error(`fetchUsers() -> Ошибка запроса: Код ответа ${response.RespCode}`);
		}

		if (!response.Body) {
			throw Error("fetchUsers() -> Ошибка: Тело ответа пустое");
		}

		const users = ParseJson(response.Body)

		return users;
	} catch (error) {
		throw Error("fetchUsers() -> " + error)
	}
}
