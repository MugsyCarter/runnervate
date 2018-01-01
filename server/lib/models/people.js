//model for the people schema
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

//people
const peopleSchema = new Schema({
    first: String,
    last: String,
    gender: String,
    age: Number
});


module.exports = mongoose.model('People', peopleSchema);