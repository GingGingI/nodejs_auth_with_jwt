const jwt = require('jsonwebtoken');

const ChkToken = (req, res, next) => {
  const token = req.headers['x-access-token'] || req.query.token;

  if (!token) {
    return res.status(403).json({
      success: false,
      message: 'failed to login',
    });
  }

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
