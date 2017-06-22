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
      return Number((5 - ((95 - score) * 0.1)).toFixed(2));
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
      .send({
        ddlxn: '2016-2017',
        ddlxq: '2',
        __EVENTVALIDATION: '/wEWGQLlp8PpBgKOwemfDgKOwemfDgKc6PHxDgKf6O1nApbomfIPApnotegBApjoofIMApvo3egOApLoyfINApXopYsNAprozbADAsCqyt4FAsOqjp8DAsKqkt8CAt2q1h8C3Kq63wMC36r+nwEC3qrCXwLZqobgAQL/wOmfDgL/wOmfDgLwr8PxAgLxr8PxAgLwksmiDjczSCJocurS4QcEJOCgu+3woHr+',
        __VIEWSTATE: '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',
      })
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
    for (let i = 0; i < data[0].length - 1; i += 1) {
      score = data[7][i + 1];
      gpa = getGpa(score);
      grade = new Grade(data[3][i + 1], data[6][i + 1], score, data[8][i + 1], gpa);

      gpaList.push(gpa);
      gradeList.push(grade);
      creditList.push(Number(data[6][i + 1]));
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

