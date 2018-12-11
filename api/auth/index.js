const router = require('express').Router();
const controller = require('./controller');
const TokenChk = require('../../middlewares/auth');

router.post('/register', controller.register);
router.post('/login', controller.login);

router.use('/check', TokenChk);
router.get('/check', controller.check);

module.exports = router;
