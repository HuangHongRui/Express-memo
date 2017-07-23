
var express = require('express');
var Note = require('../model/note');
var router = express.Router();

router.get('/notes', (req, res, next) => {
    console.log('请求到来')
    var query = {raw: true};
    console.log(query)
    console.log(req.session)
    if(req.session && req.session.user){
        query.where = { uid: req.session.user.id }
    }
    Note.findAll(query).then(notes => {      
        res.send({ status: 0, data: notes })
    }).catch(() => {
        res.send({status: 1, errorMsg: '抱歉.数据异常'})
    });
});

router.post('/notes/add', (req, res, next) => {
    if (!req.session || !req.session.user) {                 //无登陆者
        return res.send({status: 1, errorMsg: '请登录账号'})      //发送失败
    }
    if (!req.body.note){
        return res.send({status: 2, errorMsg: '抱歉,内容不可为空'})
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
        return res.send({
            status: 1,
            errorMsg: '请登录账号'
        })
    }

    var noteId = req.body.id;
    var note = req.body.note;
    var uid = req.session.user.id;
    var update = new Date().getTime();

    Note.update({
        text: note,
        updatedAt: update
    }, {where:{id: noteId, uid: uid}, returning: true, plain: true }).then((lists) => {
        console.log(lists);
        if (lists[1] === 0) {
            return res.send({status: 1, errorMsg: '无访问权限'})
        }
        res.send({status: 0});
    }).catch((e) => {
        res.send({status: 1, errorMsg: '抱歉.数据出错'})
    })
});


router.post('/notes/delete', (req, res, next) => {            //请求删除
    if (!req.session || !req.session.user) {
        return res.send({ status: 1, errorMsg: '请登录账号' })
    }

    var noteId = req.body.id;
    var uid = req.session.user.id;

    Note.destroy({ where: { id: noteId, uid: uid } }).then((deleteLen) => {
        if (deleteLen === 0) {
            return res.send({status: 1, errorMsg: '无访问权限'})
        }
        res.send({ status: 0 })
    }).catch((e) => {
        res.send({status: 1, errorMsg: '抱歉.数据出错'})
    })
});

module.exports = router;