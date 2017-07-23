
var express = require('express');             //require
var router = express.Router();                //新对象

router.get('/', function(req, res, next) {
    var loginData;                            //登录变量
    if (req.session.user) {                   //如果有登陆者
        loginData = {
            isLogin: true,                        //登录状态true
            // user: {
            //   avatar: req.session.user.avatar,    //显示头像
            //   username: req.session.user.username //显示名
            //   }
            user:req.session.user
        }
    } else {
        loginData = {
            isLogin: false                        //否则登录状态false
        }
    }
    res.render('index', loginData );        //发送页面，数据加模板组装起来渲染发送到页面上

});
module.exports = router;                    //出口

// router.get('/', function(req, res, next) {
//   var data;
//   if(req.session.user){
//     data = {
//       isLogin: true,
//       user: req.session.user
//     }
//   }else{
//     data = {
//       isLogin: false
//     }
//   }
//   console.log(data)
//   res.render('index', data);
// });
