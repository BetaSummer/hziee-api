const getGrade = require('./service/grades');
const paths = require('./config/config');
const cookieServer = require('./service/cookies');

const grade = Object.create(null);
grade = getGrade(paths.baseWebUrl.gradeUrl,)

console.log(grade);
