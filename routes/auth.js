
/**
 * Created by huanghongrui on 17-7-17.
 */
var express = require('express');
var router = express.Router();
var passport =require('passport');
var GitHubStrategy = require('passport-github').Strategy;
passport.serializeUser(function(user, done) {
    console.log('--serializeUser--');
    // console.log(user);
    done(null, user);
});

passport.deserializeUser(function(obj, done) {
    console.log('--deserialzieUser--');
    done(null, obj);
});

passport.use(new GitHubStrategy({
        clientID: '600246c4be6c231d5210',
        clientSecret: '3eeb85b722458949b52ea8db9fbf5a6c00899366',
        callbackURL: "http://memo.luckyman.xyz/auth/github/callback"
    },
    function(accessToken, refreshToken, profile, done) {
        done(null, profile)
    }
));

router.get('/github',
    passport.authenticate('github'));

router.get('/github/callback',
    passport.authenticate('github', { failureRedirect: '/login' }),
    function(req, res) {
        // console.log('succsee....');
        // console.log(req.user);
        req.session.user = {
            id: req.user.id,
            username: req.user.displayName || req.user.username,
            avatar: req.user._json.avatar_url,
            provider: req.user.provider
        };
        res.redirect('/');
});
router.get('/logout', function(req, res){
    req.session.destroy();
    res.redirect('/')
});
module.exports = router;