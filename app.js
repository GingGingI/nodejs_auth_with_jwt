const express = require('express');
const morgan = require('morgan');
const mongoose = require('mongoose');

const port = process.env.PORT || 3000;
const config = require('./config');

const app = express();

app.use(express.json());
app.use(morgan('dev'));

// jwt-secret이란 이름으로 config.key 가져옮
app.set('jwt-secret', config.key);

// index Page
app.get('/', (req, res) => {
  res.send('Hihello');
});

// /api로 들어갈시 ./api에있는 index라우터를 사용.
app.use('/api', require('./api'));

app.listen(port, () => {
  console.log(`Express is running on port ${port}`);
});

mongoose.connect(config.mongodb);
const db = mongoose.connection;
db.on('err', console.error);
db.once('open', () => {
  console.log('connect to mongo server');
});
