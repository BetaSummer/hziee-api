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
      .send({
        __EVENTTARGET: 'xqd',
      })
      .send({
        __EVENTARGUMENT: '',
      })
      .send({
        __LASTFOCUS: '',
      })
      .send({
        __VIEWSTATE: '/wEPDwUJNjg3MDc5MzMzD2QWAgIBD2QWBAIBDxAPFgYeDURhdGFUZXh0RmllbGQFAnhuHg5EYXRhVmFsdWVGaWVsZAUCeG4eC18hRGF0YUJvdW5kZ2QQFQIJMjAxNi0yMDE3CTIwMTUtMjAxNhUCCTIwMTYtMjAxNwkyMDE1LTIwMTYUKwMCZ2cWAWZkAgUPEGRkFgECAWRkuD4DXBwdVA1GfNg6wUVMIYMuW6I=',
      })
      .send({
        __EVENTVALIDATION: '/wEWCALAwbaVBwLOmbWVDAKe8p7VAgKf8qKVAwLOmemVDALB9sN7AsD2w3sCw/bDe13017Plc8YEIJHovi7ZPXOBJYpy',
      })
      .send({
        xnd: '2016-2017',
      })
      .send({
        xqd: '1',
      })
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
      exam = new Exam(data[0][i + 1], data[1][i + 1], data[2][2 + 1], data[3][i + 1]);
      examArr.push(exam);
    }
    return examArr;
  } catch (e) {
    return null;
  }
}

class ExamService {
  static async index(ctx) {
    const cookie = ctx.query.cookie;
    const stuId = ctx.query.stuId;
    const exams = await getExams(examUrl, cookie, baseHeader, stuId);
    if (exams === null) {
      ctx.throw(400, 'Bad request');
    } else if (exams === '') {
      ctx.throw(404, 'The data are unavailable now');
    } else {
      ctx.body = JSON.stringify(exams);
      this.status = 200;
    }
  }
}

module.exports = ExamService;
