//model for the accused schema
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const accusedSchema = new Schema({
    accusedID: Number,
    caseNum: Number,
    fullName: String,
    race: String,
    nationality: String,
    gender: String,
    confession: String,
    notes: String
});

module.exports = mongoose.model('Accused', accusedSchema);