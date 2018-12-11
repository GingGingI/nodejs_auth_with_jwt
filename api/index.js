const router = require('express').Router();
const auth = require('./auth');
const TokenChk = require('../middlewares/auth');
const user = require('./user');

// 라우터로 각각 auth, TokenChk, user에 연결.
router.use('/auth', auth);
router.use('/user', TokenChk);
router.use('/user', user);

// 모듈회
module.exports = router;
