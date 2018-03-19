//model for the completeIncident schema
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const requiredString = {type: String, required: true};
const requiredNumber = {type: Number, required: true};

//incident
const completeIncidentSchema = new Schema({
    caseNum: requiredNumber,
    incidentNotes: String,
    year: requiredNumber,
    month: Number,
    day: Number,
    dateNotes: String,
    latDecimal: Number,
    lonDecimal: Number,
    latDegrees: Number,
    latMinutes: Number,
    latSeconds: Number,
    lonDegrees: Number,
    lonMinutes: Number,
    lonSeconds: Number,
    state: String,
    place: String,
    county: String,
    locationNotes: String,
    locationString: String,
    crowdType: String,
    crowdSize: String,
    open: String,
    authorities: String,
    authoritiesPresent: Boolean,
    lethality: String,
    cwIndex: String,
    gdIndex: String,
    crossRefNotesCwGd: String,
    dateString: String,
    summary: String,
    accused: Array,
    books: Array,
    manuscripts: Array,
    accused: Array,
    oldNotes: Array,
    newspapers: Array

});


module.exports = mongoose.model('completeIncident', completeIncidentSchema);