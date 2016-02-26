// get packages we need
var express = require('express');
var app = express();
var morgan = require('morgan');
var path = require('path');

var config = require('./config.js'); // get our config file

// configuration
app.set('port', config.port);
var port = app.get('port');

// use morgan to log requests to console
app.use(morgan('dev'));

// serve static files
app.use(express.static('public'));

// routes
// basic routes
app.get('/', function (req, res) {
	res.sendFile(path.join(__dirname, 'public/index.html'));
});

// start the server
app.listen(port);
console.log('Web server listen at http://localhost:' + port);
;