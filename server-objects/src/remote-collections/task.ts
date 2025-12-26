declare let RESULT: ResultObject[];

interface ResultObject {
  id: number;
  code: string;
  name: string;
  status: string;
  person_id: number;
  person_fullname: string;
  finish_date: Date;
}

function showAdaptations() {
  const query = `
    SELECT cr.* 
    FROM dbo.career_reserves cr 
    WHERE cr.status = 'passed' 
        AND cr.position_type = 'adaptation'
  `;
  return ArraySelectAll<ResultObject>(tools.xquery(`sql: ${query}`));
}

RESULT = showAdaptations()