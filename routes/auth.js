
/**
 * Created by huanghongrui on 17-7-17.
 */
var express = require('express');
var router = express.Router();
var passport =require('passport');
var GitHubStrategy = require('passport-github').Strategy;

passport.serializeUser(function(user, done) {
    console.log('--serializeUser--');
    console.log(user);
    done(null, user);
});

passport.deserializeUser(function(obj, done) {
    console.log('--deserialzieUser--');
    done(null, obj);
});

passport.use(new GitHubStrategy({
    clientID: 'b7bfd7fcc56fdb76ad7f',
    clientSecret: '02de06a1c53b5d6aa9d5d805af6b936b42381ddd',
    callbackURL: "http://note.ruoyu.site/auth/github/callback"
},
function(accessToken, refreshToken, profile, done) {
    // User.findOrCreate({ githubId: profile.id }, function (err, user) {
    // });
    done(null, profile);
}
));

router.get('/github',
    passport.authenticate('github'));

router.get('/github/callback',
    passport.authenticate('github', { failureRedirect: '/login' }),
    function(req, res) {
        req.session.user = {
            id: req.user.id,
            username: req.user.displayName || req.user.username,
            avatar: req.user._json.avatar_url,
            provider: req.user.provider
        };
        res.redirect('/');
});

module.exports = router;