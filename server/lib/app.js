
const express = require('express');
const app = express();
const morgan = require('morgan');
const errorHandler = require('./error-handler');

const auths = require('./routes/auths');
const users = require('./routes/users');
const incidents = require('./routes/incidents');
const accusations = require('./routes/accusations');
const accused = require('./routes/accused');
const books = require('./routes/books');
const manuscripts = require('./routes/manuscripts');
const names = require('./routes/names');
const newspapers = require('./routes/newspapers');
const oldNotes = require('./routes/oldNotes');
const punishments = require('./routes/punishments');
const websites = require('./routes/websites');

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

app.use('/api/incidents', incidents);
app.use('/api/auths', auths);
app.use('/api/users', users);
app.use('/api/accusations', accusations);
app.use('/api/accused', accused);
app.use('/api/books', books);
app.use('/api/manuscripts', manuscripts);
app.use('/api/names', names);
app.use('/api/newspapers', newspapers);
app.use('/api/oldNotes', oldNotes);
app.use('/api/punishments', punishments);
app.use('/api/websites', websites);



app.use(errorHandler);

module.exports = app;

