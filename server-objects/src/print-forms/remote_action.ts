declare const Session: {
    sid: number
}

function getCertificateLink(certificateID: number, printFormID: number) {
    var sID = tools_web.get_sum_sid(`${printFormID}`, Session.sid)
    var result = `http://localhost/view_print_form.html?print_form_id=${printFormID}&object_id=${certificateID}&sid=${sID}`

    return result
}

function getCertificates() {
    const query = `
        SELECT 
            id,
            number
        FROM dbo.certificates
        WHERE person_id = ${curUserID}
    `

    return ArraySelectAll(XQuery(query))
}

function handler(body: object, method: string) {
  const response = {
    success: true,
    error: false,
    data: [] as unknown
  };

  if (method === "getCertificateLink") {
    const certificateID = OptInt(body.GetOptProperty("certificateID"));
    const printFormID = OptInt(body.GetOptProperty("printFormID"));
    response.data = getCertificateLink(certificateID, printFormID);
  } else if (method === "getCertificates") {
    response.data = getCertificates();
  }

  return response;
}