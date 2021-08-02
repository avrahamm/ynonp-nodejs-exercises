var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const methodOverride = require('method-override');
const cookieSession = require('cookie-session');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var sessionsRouter = require('./routes/sessions');
var postsRouter = require('./routes/posts');
var topicsRouter = require('./routes/topics');
var tokensRouter = require('./routes/tokens');
var apiRouter = require('./routes/api');

const passport = require('passport');
const flash = require('connect-flash');
require('./initializers/passport');

const mongoose = require('mongoose');
const {connectionDB, connectionOptions} = require('./lib/mongo-utils');
mongoose.connect(connectionDB,connectionOptions ).then();

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(cookieSession({
  secret: 'jhfkjasghfiuw764i7kfjhsakjfhakh',
}));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(passport.initialize());
app.use(passport.session());
app.use(flash());

const multer = require('multer');
const postPhotoUpload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 2 * 1024 * 1024,
  },
  fileFilter: function (req, file, cb) {
    const fname = file.originalname;
    const valid = [
      '.jpg',
      '.png',
      '.jpeg'
    ].find(ext => fname.endsWith(ext));
    cb(null, valid);
  }
}).single('postpic');

app.use(postPhotoUpload);
// app.use(/^[^.]+$/, debugMiddleware);
// override with POST having query string _method=DELETE in url.
// @link:http://expressjs.com/en/resources/middleware/method-override.html
app.use(methodOverride(function (req, res) {
  if (req.body && typeof req.body === 'object' && '_method' in req.body) {
    // look in urlencoded POST bodies and delete it
    var method = req.body._method
    delete req.body._method
    return method
  }
}));

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/sessions', sessionsRouter);
app.use('/posts', postsRouter);
app.use('/topics', topicsRouter);
app.use('/tokens', tokensRouter);
app.use('/api/v1.0/', apiRouter);


// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
