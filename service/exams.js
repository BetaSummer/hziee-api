const Exam = require('../model/exam');
const config = require('../config/config');
const superagent = require('superagent');
const cheerioTableparser = require('cheerio-tableparser');
const cheerio = require('cheerio');
const charset = require('superagent-charset');

charset(superagent);
const examUrl = config.baseWebUrl.examUrl;
const baseHeader = config.baseHeader;

/**
 *
 * @param {String} examUrl 考试页面 url
 * @param {String} cookie cookie
 * @param {String} header 页面 header
 * @param {String} stuId 学号
 * @return {Array} examArr 考试安排数组
 */
async function getExams(url, cookie, header, stuId) {
  try {
    const result = await superagent
      .post(`${url}${stuId}`)
      .type('form')
      .charset('gb2312')
      .set('Cookie', cookie)
      .set(header)
      .set('Referer', `${url}${stuId}`)
      .redirects(0);
    const $ = cheerio.load(result.text, {
      decodeEntities: false,
    });
    cheerioTableparser($);
    const data = $('#DataGrid1').parsetable();
    if (data.length === 0) {
      return '';
    }
    // 去除无用信息
    data.splice(0, 1);
    data.splice(4, 1);
    data.splice(1, 1);

    const examArr = [];
    let exam;
    for (let i = 0; i < data[0].length - 1; i += 1) {
      exam = new Exam(data[0][i + 1], data[1][i + 1], data[2][i + 1], data[3][i + 1]);
      examArr.push(exam);
    }
    return examArr;
  } catch (e) {
    return null;
  }
}

class ExamService {
  static async index(ctx) {
    const cookie = ctx.headers.authorization;
    const stuId = ctx.query.stuId;
    const exams = await getExams(examUrl, cookie, baseHeader, stuId);
    if (exams === null) {
      ctx.throw(401, 'Unauthorized');
    } else if (exams === '') {
      ctx.throw(404, 'The data are unavailable now');
    } else {
      ctx.body = JSON.stringify(exams);
      ctx.status = 200;
    }
  }
}

module.exports = ExamService;
