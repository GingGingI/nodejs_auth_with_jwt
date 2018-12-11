const mongoose = require('mongoose');
const crypto = require('crypto');
const config = require('../config');

const Schema = mongoose.Schema;

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

User.statics.create = function _(username, password) {
  const encrypted = crypto.createHmac('sha256', String(config.secret))
    .update(password)
    .digest('base64');

  const user = new this({
    username,
    password: encrypted,
  });

  return user.save();
};

User.statics.findOneByUsername = function _(username) {
  return this.findOne({
    username,
  }).exec();
};

// 암호화 이전코드
// User.methods.verify = function _(password) {
//   return this.password === password;
// };

User.methods.verify = function _(password) {
  const encrypted = crypto.createHmac('sha256', String(config.secret))
    .update(password)
    .digest('base64');
  return this.password === encrypted;
};

User.methods.assignAdmin = function _() {
  this.admin = true;
  return this.save();
};

module.exports = mongoose.model('User', User);
