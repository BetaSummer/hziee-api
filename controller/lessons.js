const router = require('koa-router')();

const lessonService = require('../service/lessons');

router.prefix('/lessons');

router.get('/', lessonService.index);

module.exports = router;
