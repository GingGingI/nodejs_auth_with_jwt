const router = require('express').Router();
const auth = require('./auth');
const TokenChk = require('../middlewares/auth');
const user = require('./user');


router.use('/auth', auth);
router.use('/user', TokenChk);
router.use('/user', user);

module.exports = router;
