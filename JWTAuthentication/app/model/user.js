﻿// get instance of mongoose and mongoose.Schema
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// setup mongoose model and pass it using module.exports
module.exports = mongoose.model('User', new Schema({
	name: String,
	password: String,
	email: String,
	admin: Boolean
}));