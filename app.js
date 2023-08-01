const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');

// const mongoose = require('mongoose');

const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');
const uploadRouter = require('./routes/upload');
const dbConnect = require('./config/mongoconfig');


const dotenv = require('dotenv')
dotenv.config();
const app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
//Middleware to access infomation of forms i.e accessing the body of a request
app.use(express.urlencoded({ extended : true }))

app.use('/index', indexRouter);
app.use('/users', usersRouter);
app.use('/upload', uploadRouter);

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
// mongoose.connect(process.env.DB_URL)
//     .then(()=>{
//         app.listen((process.env.PORT || 8000), ()=>{
//             console.log("CONNECTED TO DATABASE AND LISTENING")
//         })
//     })
//     .catch((err)=>{
//         console.log(err)
//     })

app.listen((process.env.PORT), dbConnect);

