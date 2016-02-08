var express = require('express');

var app = express();

require('./config/middleware.js')(app, express);

app.listen(3000);

module.exports = app;
