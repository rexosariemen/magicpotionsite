const express = require('express');
const mongoose = require('mongoose');
const logger = require('morgan');
const path = require('path');

// add routes
const magicPotionRoutes = require('./routes/api/magic');
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

// initialize app and log http reqs
const app = express();
app.use(logger('dev'));

// parse req
app.use(express.json());
app.use(express.urlencoded({extended: true}))

app.use('/magic', magicPotionRoutes);


// serve build file on production
if (process.env.NODE_ENV === "production") {
  app.use(express.static('client/build'));
}

// Redirect
app.use('/', (req, res) => {
  res.status(303).sendFile(path.resolve(__dirname, './303.html'));
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