const User = require('../../models/user');

// request에서 어드민값을 decoding해와 false면 반환
exports.list = (req, res) => {
  if (!req.decoded.admin) {
    return res.status(403).json({
      message: 'UR not admin',
    });
  }
  // true일시 데이터가져옮.
  User.find({})
    .then(users => res.json({ users }));
};
// 토큰을 가져와 해당 토큰이 어드민의 토큰이면
exports.assignAdmin = (req, res) => {
  if (!req.decoded.admin) {
    return res.status(403).json({
      message: 'UR not admin',
    });
  }
  // request에서 Param값에있는 username을 가져와 admin으로 설정.
  User.findOneByUsername(req.params.username)
    .then(user => user.assignAdmin)
    .then(res.json({ success: true }));
};
