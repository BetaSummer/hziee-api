const router = require('koa-router')();

const cookieService = require('../service/cookies');

router.prefix('/cookies');

router.post('/', cookieService.create);

module.exports = router;
