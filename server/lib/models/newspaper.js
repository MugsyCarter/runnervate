//model for the newspaper schema
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const newspaper = new Schema({
    caseNum: Number,
    incomplete: String,
    place: String,
    state: String,
    country: String,
    year: Number,
    month: Number,
    day: Number,
    dateString: String,
    articleTitle: String,
    newspaper: String,
    section: String,
    page: String,
    column: String,
    continuedPage: String,
    continuedColumn: String,
    displayPDF: String,
    link: String
});

module.exports = mongoose.model('Newspaper', newspaperSchema);