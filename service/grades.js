const Grade = require('../entity/grade');
const config = require('../config/config');
const superagent = require('superagent');
const cheerioTableparser = require('cheerio-tableparser');
const cheerio = require('cheerio');
const charset = require('superagent-charset');

charset(superagent);
const gradeUrl = config.baseWebUrl.gradeUrl;
const baseHeader = config.baseHeader;

function getGpa(score) {
  switch (true) {
    case (score === '优秀' || score >= 95):
      return 5;
    case (score === '良好'):
      return 4;
    case (score === '中等'):
      return 3;
    case (score === '及格'):
      return 2;
    case (score === '不及格'):
      return 0;
    case (score >= 60 && score < 95):
      return (5 - ((95 - score) * 0.1)).toFixed(2);
    default:
      return '';
  }
}

function getSumOfElements(list) {
  let sum = 0;
  for (let i = 0; i < list.length; i += 1) {
    sum += list[i];
  }
  return sum;
}

function getAvgOfGpa(gpaList, creditList) {
  const productList = [];
  for (let i = 0; i < gpaList.length; i += 1) {
    productList.push(gpaList[i] * creditList[i]);
  }
  return getSumOfElements(productList) / getSumOfElements(creditList);
}

async function getGrades(url, cookie, header, stuId) {
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

    if (data[0][1] === undefined) {
      return '';
    }

    const gradeList = [];
    const gpaList = [];
    const creditList = [];

    let grade;
    let gpa;
    let score;
    for (let i = 0; i < data[0].length; i += 1) {
      score = Number(data[7][i + 1]);
      gpa = getGpa(score);
      grade = new Grade(data[3][i + 1], data[6][i + 1], score, data[8][i + 1], gpa);

      gpaList.push(gpa);
      gradeList.push(grade);
      creditList.push(data[6][i + 1]);
    }
    return {
      gradeList,
      gpaAvg: getAvgOfGpa(gpaList, creditList).toFixed(3),
    };
  } catch (e) {
    return null;
  }
}

class GradeService {
  static async index(ctx) {
    const cookie = ctx.headers.authorization;
    const stuId = ctx.query.stuId;
    const grades = await getGrades(gradeUrl, cookie, baseHeader, stuId);
    if (grades === null) {
      ctx.throw(401, 'Unauthorized');
    } else if (grades === '') {
      ctx.throw(404, 'The data are unavailable now');
    } else {
      ctx.body = grades;
      ctx.status = 200;
    }
  }
}

module.exports = GradeService;

