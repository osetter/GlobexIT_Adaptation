declare let RESULT: ResultObject[];
declare let MESSAGE: string;

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
    INNER JOIN dbo.career_reserve cr_xml ON cr.id = cr_xml.id
    WHERE cr.position_type = 'adaptation'
        AND (xpath('count(/career_reserve/tasks/task[type="stage" and status!="passed"])', cr_xml.data))[1]::text::int = 0
        AND (xpath('count(/career_reserve/tasks/task[type="stage"])', cr_xml.data))[1]::text::int > 0
  `;
  return ArraySelectAll<ResultObject>(tools.xquery(`sql: ${query}`));
}

try {
  RESULT = showAdaptations();
  MESSAGE = "Адаптации успешно получены";
} catch (err) {
  RESULT = [];
  MESSAGE = "Ошибка при получении адаптаций";
}