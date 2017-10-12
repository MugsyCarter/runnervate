//model for the question schema
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const requiredString = {type: String, required: true};
const requiredNumber = {type: Number, required: true};

//question
const questionSchema = new Schema({
    question: requiredString,
    params: requiredString,
    input: requiredString,
    answerCode: String,
    unit: requiredNumber,
    quantity: requiredNumber,
    lesson: requiredNumber,
    course: requiredString,
    number: requiredNumber,
    pt: [String],
    elements: [],
    answers: [],
    options: []
});

module.exports = mongoose.model('Question', questionSchema);