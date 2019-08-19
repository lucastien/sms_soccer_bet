'use strict';

const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');
const jwt = require('jsonwebtoken');
const config = require('../config');
const bcrypt = require('bcryptjs');
const Schema = mongoose.Schema;

const userModel = new Schema({
  username: {type: String, lowercase: true, unique: true, required: [true, "can't be blank"], match: [/^[a-zA-Z0-9]+$/, 'is invalid'], index: true},
  email: {type: String, lowercase: true, unique: true, required: [true, "can't be blank"], match: [/\S+@\S+\.\S+/, 'is invalid'], index: true},
  firstname: { type: String, required: true },
  lastname: { type: String, required: true },
  password: { type: String, required: true },
  image: String,
  admin: { type: Boolean, required: true }
});

userModel.plugin(uniqueValidator, {message: ' is already taken.'})
userModel.methods.validPassword = function(password) {
  return bcrypt.compareSync(password, this.password)
};

userModel.methods.setPassword = function(password){
  var salt = bcrypt.genSaltSync(10);
  this.password = bcrypt.hashSync(password, salt);
};

userModel.methods.generateJWT = function() {
  let scopes;
  if(this.admin){
    scopes = 'admin';
  }

  return jwt.sign({
    id: this._id,
    username: this.username,
    scrope: scopes    
  }, config.secret,
  { algorithm: 'HS256', expiresIn: '60d' });
};

userModel.methods.toAuthJSON = function(){
  return {
    username: this.username,
    email: this.email,
    token: this.generateJWT(),
    bio: this.bio,
    image: this.image
  };
};
module.exports = mongoose.model('User', userModel);
