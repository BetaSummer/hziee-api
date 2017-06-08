const Koa = require('koa');
const bodyparser = require('koa-bodyparser')();
const logger = require('koa-logger');
const error = require('koa-json-error');

const env = process.env.NODE_ENV || 'development';
const port = env === 'development' ? 3000 : 4747;
const app = new Koa();

// error handler
const formatError = err => ({
  name: err.name,
  status: err.status,
  message: err.message,
});
app.use(error(formatError));

// middlewares
app.use(logger());
app.use(bodyparser);

app.use(require('./controller/cookies').routes());
app.use(require('./controller/lessons').routes());
app.use(require('./controller/exams').routes());
app.use(require('./controller/grades').routes());

app.listen(port);
