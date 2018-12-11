const jwt = require('jsonwebtoken');

// 토큰값을 받아와 체크.
const ChkToken = (req, res, next) => {
  // 헤더에 x-access-token으로 토큰값이있거나.
  // url:3000/BLABLA?token=[token]일시 가져옮.
  const token = req.headers['x-access-token'] || req.query.token;
  // 토큰이 없을경우
  if (!token) {
    return res.status(403).json({
      success: false,
      message: 'failed to login',
    });
  }
  // promise 설정
  const promise = new Promise(
    (resolve, reject) => {
      jwt.verify(token, req.app.get('jwt-secret'), (err, decoded) => {
        if (err) reject(err);
        resolve(decoded);
      });
    },
  );

  // 미들웨어로 사용할 때는 필요가없음.
  //   const respond = (tkn) => {
  //     res.json({
  //       success: true,
  //       info: tkn,
  //     });
  //   };

  const onError = (error) => {
    res.status(403).json({
      success: false,
      message: error.message,
    });
  };

  promise
    .then((decoded) => {
      req.decoded = decoded;
      next();
    }).catch(onError);
};

module.exports = ChkToken;
