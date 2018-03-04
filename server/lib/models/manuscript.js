//model for the manuscript schema
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const manuscriptSchema = new Schema({
    caseNum: Number,
    incomplete: String,
    title: String,
    manuscriptCollection: String,
    repository: String,
    location: String,	
    stateProvince: String,
    country: String,
    year: Number,	
    month: Number,
    day: Number,
    callNumber: String,
    displayPDF: String,
    pDF: String
});

module.exports = mongoose.model('Manuscript', manuscriptSchema);