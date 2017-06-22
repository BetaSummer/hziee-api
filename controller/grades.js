const router = require('koa-router')();

const gradeService = require('../service/grades');

router.prefix('/grades');

router.get('/', gradeService.index);

module.exports = router;
