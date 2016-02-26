// get packages we need
var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var morgan = require('morgan');
var mongoose = require('mongoose');
var path = require('path');

var jwt = require('jsonwebtoken'); // used to create, sign and verify tokens
var config = require('./config.js'); // get our config file
var User = require('./app/model/user.js'); // get our mongoose model

// configuration
app.set('port', config.port);
app.set('superSecret', config.secret); // secret variable
var port = app.get('port');
mongoose.connect(config.database); // connect to databse

// use bode parser so we can get info from POST and/or URL parameters
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// use morgan to log requests to console
app.use(morgan('dev'));

// routes
// basic routes
app.get('/', function (req, res) {
	res.send('Hello! The API is at http://localhost:' + port + '/api');
});
app.get('/setup', function (req, res) {
	
	// create sample user
	var user = new User({
		name: 'John Doe',
		password: '123',
		email: 'john.doe@gmail.com',
		admin: true
	});
	
	// save user in database
	user.save(function (err) {
		if (err)
			throw err;
		
		console.log('User saved successfully');
		res.json({ success: true });
	});

	// create another sample user
	var user = new User({
		name: 'Jakub Bogacz',
		password: '1234',
		email: 'jakub.bogacz@outlook.com',
		admin: true
	});
	
	// save user in database
	user.save(function (err) {
		if (err)
			throw err;
		
		console.log('User saved successfully');
		res.json({ success: true });
	});
});


// API routes
// get an instance of the router for API routes
var apiRoutes = express.Router();

// route to authenticate user (POST http://localhost:8080/api/authenticate)
apiRoutes.post('/authenticate', function (req, res) {
	User.findOne({ name: req.body.name }, function (err, user) {
		if (err)
			throw err;
		
		if (!user) {
			res.status(401).json({ success: false, message: 'Authentication failed. User not found.' });
		} else if (user) {
			
			// check if password matches
			if (user.password != req.body.password) {
				res.status(401).json({ success: false, message: 'Authentication failed. Wrong password.' });
			} else {
				
				// if user is found and password is right then create token
				var token = jwt.sign(user, app.get('superSecret'), {
					expiresIn: "1h" // expires in 1h
				});
				
				res.json({
					success: true,
					message: 'Enjoy your token!',
					token: token
				});
			}
		}
	});
});

// route middleware to verify token
apiRoutes.use(function (req, res, next) {
	// check header or url parameters or post parameters for token
	var token = req.body.token || req.query.token || req.headers['authorization'];
	
	// decode token
	if (token) {
		var parts = token.split(' ');
		if (parts.length == 2) {
			var scheme = parts[0];
			var credentials = parts[1];
			
			if (/^Bearer$/i.test(scheme)) {
				
				// verify secret and check expiry date
				jwt.verify(credentials, app.get('superSecret'), function (err, decoded) {
					if (err) {
						// if there is invalid token, return an error
						return res.status(401).json({ success: false, message: 'Failed to authenticate token' });
					} else {
						// if everything is ok, save decoded token to request for use in other routes
						req.decoded = decoded;
						next();
					}
				});
			} else {
				// if there is invalid token, return an error
				return res.status(403).send({ success: false, message: 'No token provided' });
			}
			
		} else {
			// if there is invalid token, return an error
			return res.status(403).send({ success: false, message: 'No token provided' });
		}
	} else {
		// if there is no token, return an error
		return res.status(403).send({ success: false, message: 'No token provided' });
	}
});

// route to show random mesage (GET http://localhost:8080/api/)
apiRoutes.get('/', function (req, res) {
	res.json({ message: 'Welcome to the coolest API in the world!' });
});

// route to return all users(GET http://localhost/api/users)
apiRoutes.get('/users', function (req, res) {
	User.find({}, function (err, users) {
		if (err)
			throw err;
		
		res.json(users);
	});
});

// apply the routes to our application with the prefix '/api'
app.use('/api', apiRoutes);


// start the server
app.listen(port);
console.log('API server listen at http://localhost:' + port);
