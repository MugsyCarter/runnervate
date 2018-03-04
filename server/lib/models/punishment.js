//model for the punishmentschema
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const punishmentSchema = new Schema({
    accusedID: Number,
    caseNum: Number,
    fullName: String,
    punishment: String,
    lashes: String,
    notes: String
});

module.exports = mongoose.model('Punishment', punishmentSchema);