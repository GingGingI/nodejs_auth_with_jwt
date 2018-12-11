const express = require('express');
const morgan = require('morgan');
const mongoose = require('mongoose');

const port = process.env.PORT || 3000;
const config = require('./config');

const app = express();

app.use(express.json());
app.use(morgan('dev'));

app.set('jwt-secret', config.key);

app.get('/', (req, res) => {
  res.send('jwtTest');
});

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
