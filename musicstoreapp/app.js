var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

//var indexRouter = require('./routes/index');
//var usersRouter = require('./routes/users');

let app = express();

let expressSession = require('express-session');
app.use(expressSession({
    secret: 'abcdefg',
    resave: true,
    saveUninitialized: true
}));

let crypto = require('crypto');
let fileUpload = require('express-fileupload');
app.use(fileUpload({
  limits: { fileSize: 50 * 1024 * 1024 },
  createParentPath: true
}));
app.set('uploadPath', __dirname);
app.set('clave','abcdefg');
app.set('crypto',crypto);

let bodyParser = require('body-parser');
//Para poder procesa JSON
app.use(bodyParser.json());
//Para poder procesar formularios extándar
app.use(bodyParser.urlencoded({ extended: true }));

let indexRouter = require('./routes/index');
//let usersRouter = require('./routes/users');

const { MongoClient } = require("mongodb");
const url = 'mongodb+srv://admin:admin@tiendamusica.72v7m.mongodb.net/myFirstDatabase?retryWrites=true&w=majority';
app.set('connectionStrings', url);

//ANTES DE LOS CONTROLADORES DE USERS Y SONGS
const userSessionRouter = require('./routes/userSessionRouter');
const userAudiosRouter = require('./routes/userAudiosRouter');
app.use("/songs/add",userSessionRouter);
app.use("/publications",userSessionRouter);
app.use("/songs/buy",userSessionRouter);
app.use("/purchases",userSessionRouter);
app.use("/audios/",userAudiosRouter);
app.use("/shop/",userSessionRouter)

const userAuthorRouter = require('./routes/userAuthorRouter');
//Para editar y borrar se hara una comprobacion de q el usuario es propietario de esas canciones
app.use("/songs/edit",userAuthorRouter);
app.use("/songs/delete",userAuthorRouter);

let songsRepository = require("./repositories/songsRepository.js");
let commentsRepository = require("./repositories/commentsRepository.js");
songsRepository.init(app, MongoClient);
commentsRepository.init(app, MongoClient);
require("./routes/songs.js")(app, songsRepository, commentsRepository);
//require("./routes/songs.js")(app, commentsRepository);
require("./routes/songs.js")(app, MongoClient);

require("./routes/comments.js")(app, commentsRepository);

const usersRepository = require("./repositories/usersRepository.js");
usersRepository.init(app, MongoClient);
require("./routes/users.js")(app, usersRepository);

require("./routes/author.js")(app);

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'twig');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
//app.use('/users', usersRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
    console.log("Se ha producido un error "+ err);
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};
  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
