//model for the lesson schema
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const requiredString = {type: String, required: true};
const requiredNumber = {type: Number, required: true};

//lesson
const lessonSchema = new Schema({
    name: requiredString,
    tagline: requiredString,
    course: requiredString,
    unit: requiredNumber,
    number: requiredNumber,
    video: requiredString,
    imageUrl: String
});

module.exports = mongoose.model('Lesson', lessonSchema);