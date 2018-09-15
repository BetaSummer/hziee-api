const router = require('koa-router')();

const creditService = require('../service/credit');

router.prefix('/credit');
router.get('/', creditService.create);

module.exports = router;
