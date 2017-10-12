//model for the course schema
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const requiredString = {type: String, required: true};

//course
const courseSchema = new Schema({
    name: requiredString,
    title: requiredString,
    tagline: requiredString,
    units: []
});


module.exports = mongoose.model('Course', courseSchema);