var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  var loginData;
  if (req.session.user) {
    var loginData = {
      isLogin: true,
      user: {
        avatar: req.session.user.avatar,
        username: req.session.user.username
        }
      }
  } else {
     loginData = {
      isLogin: false
    }
  }
    res.render('index', loginData );

});
module.exports = router;

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
