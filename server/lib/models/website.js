//model for the website schema
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const website = new Schema({
    caseNum: Number,
    incomplete: String,
    accessed: Date;
    url: String,
    title: String,	
    auFn: String,	
    auMn: String,
    auLn: String,
    auSuffix: String,
    edComp: String,
    publisher: String,
    volume: String,	
    pages: String,	
    title: String,
    location: String,	
    stateProvince: String,
    country: String,
    dateYear: Number,	
    dateMonth: Number,
    dateDay: Number,
    collection: String,
    repository: String,
    callNumber: String,
    displayPDF: String,
    pDF: String
});

module.exports = mongoose.model('Website', websiteSchema);