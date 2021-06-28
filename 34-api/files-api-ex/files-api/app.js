var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const errorsLogger = require('./lib/utils/logger');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
const filesRouter = require('./routes/files');

var app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/api/v1.0/files', filesRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
    next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
    if (err) {
        errorsLogger.error(JSON.stringify(err));
    }

    // render the error page
    res.sendStatus(err.status || 500);
});

module.exports = app;
