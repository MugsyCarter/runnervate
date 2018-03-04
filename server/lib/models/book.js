//model for the book schema
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const bookSchema = new Schema({
    caseNum: Number,
    incomplete: String,
    auFn: String,	
    auMn: String,	
    auLn: String,	
    auSuffix: String,
    edComp: String,
    editorFn: String,
    editorMn: String,
    editorLn: String,
    editorSuffix: String,
    title: String,
    placePub: String,
    publisher: String,
    yearPub: String,
    volume: String,	
    pages: String,
    displayPDF: String,
    pDF: String
});

module.exports = mongoose.model('Book', bookSchema);