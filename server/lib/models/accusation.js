//model for the accusation schema
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const accusationSchema = new Schema({
    accusedID: Number,
    caseNum: Number,
    fullName: String,
    accusation: String,
    weapon: String,
    notes: String
});

module.exports = mongoose.model('Accusation', accusationSchema);