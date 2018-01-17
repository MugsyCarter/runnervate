//model for the user schema
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

//encryption module
const bcrypt = require('bcryptjs');

const requiredString = {type: String, required: true};

//user
const userSchema = new Schema({
    username: requiredString,
    password: requiredString,
    name: requiredString,
    email: requiredString,
    dob: Date,
    role: String,
    trips: []
});

//when user signs in - hash generated from password
//this is a method on the instance
userSchema.methods.generateHash = function(password) {
    return this.password = bcrypt.hashSync(password, 8);
};

//when user signs in - compare password against stored hash
//this is a method on the instance
userSchema.methods.compareHash = function(password) {
    return bcrypt.compareSync(password, this.password);
};

module.exports = mongoose.model('User', userSchema);
