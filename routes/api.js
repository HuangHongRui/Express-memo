var express = require('express');
var router = express.Router();
var Note = require('../model/note').Note;

router.get('/notes', function(req, res, next){
  // console.log('/notes...')
  var query = {raw: true};
  if(req.session.user){
    query.where = {
      uid: req.session.user.id
    }
  }
  Note.findAll(query).then(function(notes) {
    console.log(notes);
    res.send({status: 0, data: notes})
  }).catch(() => {
      res.send({status: 1, errorMsg: '抱歉.数据出错'})
  });
});

router.post('/notes/add', function(req, res, next){
  if (!req.session.user) {
    return res.send({status: 1, errorMsg: '请登录账号'})
  }
  var uid = req.session.user.id; //raise safety
  var note = req.body.note;
  Note.create({text: note, uid: uid}).then(() => {
    res.send({status: 0})
  }).catch(() => {
    res.send({status: 1, errorMsg: '抱歉.数据出错'})
  });
});

router.post('/notes/edit', function(req, res, next){
  if (!req.session.user) {
      return res.send({status: 1, errorMsg: '请登录账号'})
  }  
  var uid = req.session.user.id;
  Note.update({text: req.body.note}, {where:{id: req.body.id, uid: uid}}).then(() => {
    res.send({status: 0})
  }).catch(() => {
    res.send({status: 1, errorMsg: '抱歉.数据出错'})
  })
});

router.post('/notes/delete', function(req, res, next){
  if (!req.session.user) {
      return res.send({status: 1, errorMsg: '请登录账号'})
  }
  var uid = req.session.user.id;
  Note.destroy({where: {id: req.body.id, uid: uid}}).then(() => {
    res.send({status: 0})
  }).catch(() => {
    res.send({status: 1, errorMsg: '抱歉.数据出错'})
  })
});

module.exports = router;