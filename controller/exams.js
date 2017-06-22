const router = require('koa-router')();

const examService = require('../service/exams');

router.prefix('/exams');

router.get('/', examService.index);

module.exports = router;
