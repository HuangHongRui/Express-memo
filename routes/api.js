var express = require('express');                           //请求
var Note = require('../model/note').Note;                   //请求note
var router = express.Router();                              //创建一个新的路由器对象。

router.get('/notes', (req, res, next) => {                  //来自notes的请求
  var query = {raw: true};                                  //
  if(req.session && req.session.user){                      //如果有使用者登录
    query.where = { uid: req.session.user.id }              //
  }
  Note.findAll(query).then(notes => {                       //查询多条数据
    // console.log(notes);
    res.send({status: 0, data: notes})                      //发送成功状态与数据
  }).catch(() => {
      res.send({status: 1, errorMsg: '抱歉.数据异常'})        //失败
  });
});

router.post('/notes/add', (req, res, next) => {             //来自添加内容的请求
  if (!req.session || !req.session.user) {                 //无登陆者
    return res.send({status: 1, errorMsg: '请登录账号'})      //发送失败
  }
  if (!req.body.note){
    return res.send({status: 2, errorMsg: '抱歉,内容为空'})
  }
  var uid = req.session.user.id;                            //uid
  var note = req.body.note;                                 //内容
  var username = req.session.user.username;                 //用户名
  var update = new Date().getTime();                        //更新时间
  Note.create({
     text: note,
     uid: uid,
     username: username,
     createTime: update,
     updateTime: update
  }).then((data) => {
    res.send({
        status: 0,
        result: data.get({plain: true})
    })
  }).catch(() => {
    res.send({
        status: 1,
        errorMsg: '抱歉.数据出错或无权限'
    })
  });
});

router.post('/notes/edit', (req, res, next) => {             //更改
  if (!req.session || !req.session.user) {                   //验证是否登录
    return res.send({status: 1, errorMsg: '请登录账号'})       //告知
  }

  var uid = req.session.user.id,                             //uid
      note = req.body.note,                                  //内容
      noteId = req.body.id;                                  //内容所属id

  Note.update({text: note}, {where:{id: noteId, uid: uid}}).then((lists) => {
    if (lists[0] === 0) {
      return res.send({status: 1, errorMsg: '无访问权限'})
    }
    res.send({status: 0});
  }).catch(() => {
    res.send({status: 1, errorMsg: '抱歉.数据出错'})
  })
});


router.post('/notes/delete', (req, res, next) => {            //请求删除
  if (!req.session.user) {
    return res.send({status: 1, errorMsg: '请登录账号'})
  }

  var uid = req.session.user.id;
  var noteId = req.body.id;

  Note.destroy({where: {id: noteId, uid: uid}}).then((deleteLen) => {
    if (deleteLen === 0) {
      return res.send({status: 1, errorMsg: '无访问权限'})
    }
    res.send({status: 0})
  }).catch(() => {
    res.send({status: 1, errorMsg: '抱歉.数据出错'})
  })
});

module.exports = router;