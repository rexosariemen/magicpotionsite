const express = require('express');
const mongoose = require('mongoose');
const logger = require('morgan');
const path = require('path');
const bodyParser = require('body-parser');
const cors = require('cors');

// add routes
// const indexRouter = require('./routes/index');
const magicPotionRouter = require('./routes/api/magic');
const url = require('./config').mongoUrl;

// Database construct
const connect = mongoose.connect(process.env.MONGODB_URI || url, {
  useCreateIndex: true,
  useFindAndModify: false,
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

connect.then(() => console.log('Connected to MongoDBserver'),
  err => console.log(err)
);

const port = process.env.PORT || '5500';

//  initialize app
const app = express();
app.use(logger('dev'));

app.use(express.json());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true
}));

app.use(cors());
// app.use(express.urlencoded({ extended: false }));

//! magic route
app.use('/magic', magicPotionRouter);
app.use('/magic', (req, res) => {
  console.log('req.body from server.js: ', req.body);
});

// serve build file on production
if (process.env.NODE_ENV === "production") {
  app.use(express.static('client/build'));
}

app.use('/', (req, res) => {
  res.status(404).sendFile(path.resolve(__dirname, './404.html'));
})

// global error handler
app.use((err, req, res) => {
  const defaultErr = {
    log: 'Express error handler caught unknown middleware error',
    status: 404,
    message: 'resource not found',
  };

  const errorObj = Object.assign(defaultErr, err);
  console.log(errorObj.message);
  console.log(err);
  return res.status(errorObj.status).json(errorObj.message);
});

app.listen(port, () => {
  console.log(`Server started on PORT: ${port}`);
});