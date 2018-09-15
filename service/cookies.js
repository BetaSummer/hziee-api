const config = require('../config/config');
const superagent = require('superagent');

const loginUrl = config.baseWebUrl.loginUrl;
const baseHeader = config.baseHeader;

async function getCookie(url) {
  try {
    const result = await superagent.get(url);
    return result.headers['set-cookie'][0];
  } catch (e) {
    throw e;
  }
}

async function isQualified(url, cookie, header, info) {
  try {
    await superagent
      .post(url)
      .type('form')
      .set('Cookie', cookie)
      .set(header)
      .send({
        TextBox1: info.stuID,
      })
      .send({
        TextBox2: info.password,
      })
      .send({
        __VIEWSTATE: '/wEPDwUKLTY4Mjg3NzI5NGRk+yAaA352cuwlk0iYbcRxiF6UJVc=',
      })
      .send({
        __EVENTVALIDATION: '/wEWCgL0h9HvCQLs0bLrBgLs0fbZDAK/wuqQDgKAqenNDQLN7c0VAuaMg+INAveMotMNAoznisYGArursYYIsRYr0nH6eJRR4eD1mC6FIuZeuVY=',
      })
      .send({
        RadioButtonList1: '%D1%A7%C9%FA',
      })
      .send({
        Button1: '',
      })
      .redirects(0);
    return false;
  } catch (e) {
    if (e.status === 302) {
      // 状态码302：表示发生重定向，登录成功
      return true;
    }
    return false;
  }
}

class CookieService {
  static async create(ctx) {
    const body = ctx.request.body;
    const cookie = await getCookie(loginUrl);
    if (await isQualified(loginUrl, cookie, baseHeader, body)) {
      ctx.body = {
        cookie,
      };
      ctx.status = 201;
    } else {
      ctx.throw(401, 'Authentication failed');
    }
  }
}

module.exports = CookieService;
