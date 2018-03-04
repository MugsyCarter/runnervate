//model for the oldNote schema
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const oldNoteSchema = new Schema({
    caseNum: Number,
    pDF: String
});

module.exports = mongoose.model('OldNote', oldNoteSchema);