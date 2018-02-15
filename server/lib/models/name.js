//model for the name schema
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const name = new Schema({
    accusedID: Number,
    caseNum: Number,
    fullName: String,
    first: String,
    middle: String,
    last: String
});

module.exports = mongoose.model('Name', nameSchema);