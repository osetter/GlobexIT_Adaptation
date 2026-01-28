declare const learningDoc: LearningDocumentTopElem;
declare const courseDoc: CourseDocumentTopElem;
declare const activeLearningDoc: ActiveLearningDocumentTopElem;

interface ActiveLearning {
    id: number;
    attempts_num: number;
}

interface Course {
    id: number;
}

function main() {
  const isCoursePassed = learningDoc.state_id == 4;
  if (isCoursePassed) {
    const activeLearningId = OptInt((activeLearningDoc as any).id, 0);
    const query = `
      SELECT al.id,
        COALESCE((xpath('/active_learning/attempts_num/text()', al.data))[1]::text::int, 0) AS attempts_num
      FROM dbo.active_learning al
      WHERE al.id = ${activeLearningId}
    `;
    const activeLearningRecord = ArrayOptFirstElem<ActiveLearning>(tools.xquery(`sql: ${query}`));
    const attemptsNum = OptInt(activeLearningRecord.attempts_num, 0);
    if (attemptsNum < 3) {
      const newCourseQuery = `
        SELECT id
        FROM dbo.courses
        WHERE id != ${courseDoc.id}
        LIMIT 1
      `;
      const newCourse = ArrayOptFirstElem<Course>(tools.xquery(`sql: ${newCourseQuery}`));
      if (newCourse != undefined) {
        tools.activate_course_to_person(learningDoc.person_id, newCourse.id);
      }
    }
  }
}
main();
