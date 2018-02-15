//model for the punishmentschema
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const punishment = new Schema({
    accusedID: Number,
    caseNum: Number,
    fullName: String,
    accusation: String,
    weapon: String,
    notes: String
});

module.exports = mongoose.model('Punishmen', punishmentSchema);