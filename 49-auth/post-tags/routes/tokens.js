var express = require('express');
var router = express.Router();
const jwt = require('jsonwebtoken');
const ensureLoggedIn = require('connect-ensure-login').ensureLoggedIn;

router.use(ensureLoggedIn('/sessions/new'));

router.post(['/'],
    ensureLoggedIn('/sessions/new'),
);

router.get('/new', function(req, res, next) {
    res.render('tokens/new', { token: null });
});

router.post('/', function(req, res, next) {
    const token = jwt.sign(
        { id: req.user.id },
        'ninja',
        { expiresIn: '7d' },
    )
    res.render('tokens/new', { token });
});

module.exports = router;