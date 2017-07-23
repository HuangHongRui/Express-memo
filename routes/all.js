var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', (req, res, next) => {
  var data;
  if(req.session.user){       //如果用户登录
    data = {
      isLogin: true,          //登录状态：true
      user: req.session.user  //导入用户
    }
  }else{
    data = {
      isLogin: false          //状态false
    }
  }
  // console.log(data)
  res.render('index', data);  //数据渲染|渲染index并将呈现的HTML字符串到客户端
});

module.exports = router;

