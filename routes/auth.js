
/**
 * Created by huanghongrui on 17-7-17.
 */
var express = require('express');                //
var passport =require('passport');               //
var router = express.Router();                   //创建一个新的路由对象
var GitHubStrategy = require('passport-github').Strategy;   //github战略-。-

passport.serializeUser((user, done) => {
    console.log('---serializeUser---');
    console.log(user)
    done(null, user);
});

passport.deserializeUser((obj, done) => {
    console.log('---deserializeUser---');
    done(null, obj);
});

passport.use(new GitHubStrategy({
        clientID: '600246c4be6c231d5210',                               //id
        clientSecret: '3eeb85b722458949b52ea8db9fbf5a6c00899366',       //秘钥
        callbackURL: "http://localhost:3000/auth/github/callback"    //回调
    },
    (accessToken, refreshToken, profile, done) => {
        done(null, profile)
    }
));

router.get('/logout', (req, res) => {           //退出请求
    req.session.destroy();                      //删除记录
    res.redirect('/');                          //重定向到根目录
});

router.get('/github',
    passport.authenticate('github'));           //有效

router.get('/github/callback',
    passport.authenticate('github', { failureRedirect: '/login' }),
    (req, res) => {
        req.session.user = {                    //请求登陆者信息
            id: req.user.id,                    //id
            username: req.user.displayName || req.user.username,    //id名
            avatar: req.user._json.avatar_url,  //头像
            provider: req.user.provider         //提供者
        };
        res.redirect('/');                      //重定向
    });

module.exports = router;