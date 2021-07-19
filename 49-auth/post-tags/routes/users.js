const createError = require('http-errors');
var express = require('express');
var router = express.Router();
const ensureLoggedIn = require('connect-ensure-login').ensureLoggedIn;

const User = require('../models/user');

router.get(['/edit'],
    ensureLoggedIn('/sessions/new'),
);

router.put(['/:id'],
    ensureLoggedIn('/sessions/new'),
);

/* GET users listing. */
router.get('/new', function(req, res, next) {
  res.render('users/new', { user: new User() });
});

router.post('/', async function(req, res, next) {
  const user = new User(req.body);
  try {
    await user.save();
  } catch (err) {
    return res.render('users/new', { user: user });
  }
  res.redirect('/');  
});

router.get('/edit', function(req, res, next) {
  res.render('users/edit', { user: req.user });
});

router.put('/:id', async function(req,res,next) {
  try {
    if ( req.params.id !== (req.user._id).toString()) {
      throw new Error(`Trying to update 
      other user.id ${req.params.id} 
      instead req.user._id =${req.user._id}`
      )
    }

    const {name, email} = req.body;
    req.user = await User.findOneAndUpdate(
        {_id: req.params.id},
        {name, email},
        {new: true}
    );
    res.redirect('/');
  }
  catch (e) {
    return next(createError(e));
  }
})

module.exports = router;
