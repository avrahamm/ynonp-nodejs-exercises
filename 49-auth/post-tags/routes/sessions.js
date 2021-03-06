var express = require('express');
var router = express.Router();
const passport = require('passport');

// GET /sessions/new
router.get('/new', function (req, res, next) {
    res.render('sessions/new', { error: req.flash('error') });
});

router.post('/', passport.authenticate(
    'local',
    {
        successRedirect: '/',
        failureRedirect: '/sessions/new',
        failureFlash: true,
    }
));

router.post('/logout', function(req, res, next) {
    req.logout();
    res.redirect('/');
});

module.exports = router;