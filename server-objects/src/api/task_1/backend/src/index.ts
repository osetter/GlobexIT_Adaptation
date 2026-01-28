//=require ./modules/devmode.ts
//=require ./modules/users.ts

/* --- logic --- */
function handler(body: object, method: string) {
	if (method === "fetchUsers")
		return fetchUsers()
}

/* --- start point --- */
function main(req: Request, res: Response) {
	try {
		const body = req.Query;
		const method = tools_web.convert_xss(body.GetOptProperty("method"))

		if (method === undefined) {
			throw HttpError({
				code: 400,
				message: "unknown method"
			});
		}

		const payload = handler(body, method);

		res.Write(tools.object_to_text(payload, "json"));

	} catch (error) {
		const errorObject = tools.read_object(error);
		Request.RespContentType = "application/json";
		Request.SetRespStatus(errorObject.GetOptProperty("code", 500), "");
		Response.Write(errorObject.GetOptProperty("message", error));
	}
}

main(Request, Response);

export {}
