const jwt = require('jsonwebtoken');
const User = require('../../models/user');

/*
    POST /api/auth
    {
        username,
        password
    }
*/
// 회원가입
exports.register = (req, res) => {
  const { username, password } = req.body;
  let newUser = null;

  // user를 받아와 없으면 에러 있으면 create
  const create = (user) => {
    if (user) {
      throw new Error('username exists');
    } else {
      return User.create(username, password);
    }
  };

  // DB에서 유저수를 가져옮.
  const count = (user) => {
    newUser = user;
    return User.count({}).exec();
  };

  // 첫번째 유저일경우 어드민으로 설정.
  const assign = (cnt) => {
    if (cnt === 1) {
      return newUser.assignAdmin();
    }
    // 아닐경우 false값을 가진 promise 리턴
    return Promise.resolve(false);
  };

  // 클라이언트로 respond
  const respond = (isAdmin) => {
    res.json({
      message: 'registered successfully',
      admin: isAdmin,
    });
  };

  // 에러가 날경우 실행 (예: 유저이름 중복)
  const onError = (error) => {
    res.status(409).json({
      message: error.message,
    });
  };

  // 유저네임 체크.
  User.findOneByUsername(username)
    .then(create)
    .then(count)
    .then(assign)
    .then(respond)
    .catch(onError);
};

exports.login = (req, res) => {
  const { username, password } = req.body;
  const secret = req.app.get('jwt-secret');

  // 유저를 가져와서 체크 없을시 에러
  const check = (user) => {
    if (!user) {
      throw new Error('login failed');
    } else if (user.verify(password)) {
      // header | 시크릿코드 | body
      const promise = new Promise((resolve, reject) => {
        jwt.sign(
          {
            _id: user._id,
            username: user.username,
            admin: user.admin,
          },
          secret,
          {
            expiresIn: '7d',
            issuer: 'jwtTokenAuthTest',
            subject: 'userInfo',
          }, (err, token) => {
            // 에러받으면 reject(에러) 처리
            if (err) reject(err);
            resolve(token);
          },
        );
      });
      return promise;
    } else {
      throw new Error('login failed');
    }
  };

  const respond = (token) => {
    // 로그인 할시 해당토큰값 출력
    res.json({
      message: 'login success',
      token,
    });
  };

  const onError = (error) => {
    res.status(403).json({
      message: error.message,
    });
  };

  User.findOneByUsername(username)
    .then(check)
    .then(respond)
    .catch(onError);
};

exports.check = (req, res) => {
  res.json({
    success: true,
    info: req.decoded,
  });
};
