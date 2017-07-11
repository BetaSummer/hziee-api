const superagent = require('superagent');
const cheerioTableparser = require('cheerio-tableparser');
const cheerio = require('cheerio');
const charset = require('superagent-charset');
const config = require('../config/config');
const Lesson = require('./../entity/lesson');

const scheduleUrl = config.baseWebUrl.scheduleUrl;
const baseHeader = config.baseHeader;
charset(superagent);

/**
 * 根据课程节数返回课程时间段
 *
 * @param {Array} nodeArr 课程节数数组:['3','4','5']
 * @return {String} 课程时间段
 */
const getPeriod = (nodeArr) => {
  const firstNum = parseInt(nodeArr[0], 0);
  switch (true) {
    case nodeArr.length === 3 && firstNum === 3:
      return '10:05~12:30';
    case nodeArr.length === 3 && firstNum === 6:
      return '13:30~15:55';
    case nodeArr.length === 3 && firstNum === 10:
      return '18:30~20:55';
    case nodeArr.length === 2 && firstNum === 1:
      return '8:20~9:55';
    case nodeArr.length === 2 && firstNum === 3:
      return '10:05~11:40';
    case nodeArr.length === 2 && firstNum === 6:
      return '13:30~15:05';
    case nodeArr.length === 2 && firstNum === 8:
      return '15:10~16:45';
    case nodeArr.length === 2 && firstNum === 10:
      return '18:30~20:05';
    case nodeArr.length === 1 && firstNum === 8:
      return '15:10~15:55';
    default:
      return '';
  }
};

/**
 * 从数组中删除指定元素
 *
 * @param {Array} arr 数组
 * @param {Array} eleArr 被删除的元素数组
 * @return {Array} 删除完毕后的数组
 */
const deleteElements = function deleteElements(arr, eleArr) {
  return arr.filter(ele =>
    eleArr.includes(ele));
};

/**
 * 数组去重
 *
 * @param {Array} arr 待去重的数组
 * @return {Array} 去重后的数组
 */
const unique = arr => Array.from(new Set(arr));

/**
 *
 * @param {String} url 课表页面 url
 * @param {String} cookie cookie
 * @param {String} header 页面 header
 * @param {String} stuId 学号
 * @return {Array} weeklyLessonArr 一周课程数组
 */
async function getAllLessons(url, cookie, header, stuId) {
  const weeklyLessonArr = [];
  try {
    const resultPage = await superagent
      .post(`${url}${stuId}`)
      .charset('gb2312')
      .set('Cookie', cookie)
      .set(header)
      .set('Referer', `${url}${stuId}`)
      .redirects(0);
    const $ = cheerio.load(resultPage.text, {
      decodeEntities: false,
    });
    cheerioTableparser($);
    const data = $('#Table1').parsetable().slice(2, 7);
    let lessonDetailArr;
    let lessonNodeArr;
    let lessonPeriod;
    let lessonDate;
    let lesson;
    data.forEach((ele) => {
      const dailyLessonArr = [];
      const dataList = deleteElements(unique(ele), ['', '&nbsp;']);
      // dataList: ['星期一','英语<br>周一第1,2节<br>Jack Ma<br>6jxB13', '离散数学...']
      lessonDate = dataList.shift();
      dataList.forEach((item) => {
        // item: '英语<br>周一第1,2节<br>Jack Ma<br>6jxB13'
        lessonDetailArr = item.split('<br>');
        // lessonDetail: ['英语','周一第1,2节','Jack Ma,'6jxB13']
        lessonNodeArr = lessonDetailArr[1].substring(lessonDetailArr[1].indexOf('第') + 1, lessonDetailArr[1].indexOf('节')).split(',');
        // lessonNodeArr: ['1','2']
        lessonPeriod = getPeriod(lessonNodeArr);
        lesson = new Lesson(lessonDetailArr[0], lessonDate, lessonDetailArr[1], lessonPeriod, lessonDetailArr[2], lessonDetailArr[3]);
        dailyLessonArr.push(lesson);
      });
      weeklyLessonArr.push(dailyLessonArr);
    });
    return weeklyLessonArr;
  } catch (e) {
    return null;
  }
}

class LessonService {
  static async index(ctx) {
    const cookie = ctx.headers.authorization;
    const stuId = ctx.query.stuId;
    const lessons = await getAllLessons(scheduleUrl, cookie, baseHeader, stuId);
    if (lessons) {
      ctx.body = lessons;
      ctx.status = 200;
    } else {
      ctx.throw(401, 'Unauthorized');
    }
  }
}

module.exports = LessonService;
