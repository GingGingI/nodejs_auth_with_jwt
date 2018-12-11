const mongoose = require('mongoose');
const crypto = require('crypto');
const config = require('../config');

const Schema = mongoose.Schema;

// 데이터 입력을 위한 스키마 생성
const User = new Schema({
  username: String,
  password: String,
  admin: { type: Boolean, default: false },
});

// 암호화 이전코드.
// User.statics.create = function _(username, password) {
//   const user = new this({
//     username,
//     password,
//   });

//   return user.save();
// };

// 암호화 이후코드
User.statics.create = function _(username, password) {
  // Sha256알고리즘으로 password를 암호화
  const encrypted = crypto.createHmac('sha256', config.key)
    .update(password)
    .digest('base64');

  // 암호화된 password와 username 으로 저장.
  const user = new this({
    username,
    password: encrypted,
  });

  return user.save();
};
// Username 으로 db에서 비교하여 사용자체크.
User.statics.findOneByUsername = function _(username) {
  return this.findOne({
    username,
  }).exec();
};

// 암호화 이전코드
// User.methods.verify = function _(password) {
//   return this.password === password;
// };

// 암호화 이후코드.
User.methods.verify = function _(password) {
  // Sha256알고리즘으로 password를 암호화
  const encrypted = crypto.createHmac('sha256', config.key)
    .update(password)
    .digest('base64');
  // 방금 암호화한 password와 db에저장된 암호화된 password를 비교.
  return this.password === encrypted;
};

// 해당 유저를 admin으로 승격후 저장.
User.methods.assignAdmin = function _() {
  this.admin = true;
  return this.save();
};

module.exports = mongoose.model('User', User);
