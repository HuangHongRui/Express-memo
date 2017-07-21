var express = require('express');               //请求express
var path = require('path');                     //请求path
var favicon = require('serve-favicon');         //服务图标中间件
var logger = require('morgan');                 //HTTP请求记录器中间件
var cookieParser = require('cookie-parser');    //解析Cookie并填充req.cookies由cookie名键入的对象
var bodyParser = require('body-parser');        //Node.js正文解析中间件
var passport = require('passport');             //兼容认证中间件
var session = require('express-session');       //会话中间件

var index = require('./routes/index');          //路由
var api = require('./routes/api');
var auth = require('./routes/auth');
var all = require('./routes/all');
var app = express();							//调用express得到app，可理解整个网站的逻辑就是这个app去处理的

// 引擎设置
app.set('views', path.join(__dirname, 'views'));//
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(session({secret: 'Thisskey123321'}));    //加密
app.use(passport.initialize());                  //认证初始
app.use(passport.session());                     //认证

app.use('/', index);							 //当一个/开头请求过来，交由index处理
app.use('/auth', auth);							 //以/auth开头的请求过来，交由auth处理
app.use('/api', api);							 //
app.use('/all', all);                            //全部便签

app.use((req, res, next) => {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// 错误处理
app.use((err, req, res, next) => {
  //提示本地开发错误
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // 渲染错误页面
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
