
const express = require('express');
const app = express();
const morgan = require('morgan');
const errorHandler = require('./error-handler');

const courses = require('./routes/courses');
const auths = require('./routes/auths');
const users = require('./routes/users');
const elements = require('./routes/elements');
const questions = require('./routes/questions');
const lessons= require('./routes/lessons');

app.use(morgan('dev'));

app.use((req, res, next) => {
    // set cors headers
    const url = '*';
    res.header('Access-Control-Allow-Origin', url);
    res.header('Access-Control-Allow-Methods', 'POST, GET, PUT, DELETE, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    next();
});

app.use(express.static('./public'));

app.use('/api/trips', trips);
app.use('/api/auths', auths);
app.use('/api/users', users);

app.use(errorHandler);

module.exports = app;

