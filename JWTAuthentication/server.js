// get packages we need
var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var morgan = require('morgan');
var mongoose = require('mongoose');

var jwt = require('jsonwebtoken'); // used to create, sign and verify tokens
var config = require('./config.js'); // get our config file
var User = require('./app/model/user.js'); // get our mongoose model

// configuration
var port = process.env.PORT || 8080; // used to create, sign and verify tokens
mongoose.connect(config.database); // connect to databse
app.set('superSecret', config.secret); // secret variable

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
	
	// create samle user
	var user = new User({
		name: 'John Doe',
		password: '123',
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

// TODO: route to authenticate user (POST http://localhost:8080/api/authenticate)
apiRoutes.post('/authenticate', function (req, res) {
	User.findOne({ name: req.body.name }, function (err, user) {
		if (err)
			throw err;
		
		if (!user) {
			res.json({ success: false, message: 'Authentication failed. User not found.' });
		} else if (user) {
			
			// check if password matches
			if (user.password != req.body.password) {
				res.json({ success: false, message: 'Authentication failed. Wrong password.' });
			} else {
				
				// if user is found and password is right then create token
				var token = jwt.sign(user, app.get('superSecret'), {
					expiresInMinutes: 1440 // expires in 24H
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

		


// TODO: route middleware to verify token

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
console.log('Magic happens at http://localhost:' + port);
