//model for the trip schema
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const requiredString = {type: String, required: true};
const requiredNumber = {type: Number, required: true};

//trip
const tripSchema = new Schema({
    caseNum: requiredString,
    origDBIndex: Number,
    cwIndex: String,
    gdIndex: String,
    crossRefNotesCwGd: String,
    latDecimal: Number,
    lonDecimal: Number,
    latNDegrees:Number,
    latNMinutes:Number,
    latNSeconds:Number,
    lonWDegrees:Number,
    lonWMinutes:Number,
    lonWSeconds:Number,
    year: requiredNumber,
    month: Number,
    day: Number,
    dateString: String,
    dateNotes: String,
    state: String,
    place: String,
    county: String,
    locationNotes: String,
    crowdType: String,
    crowdSize: String,
    open: String,
    oldAuthorities: String,
    authoritiesPresent: Boolean,
    authoritiesNotes: String,
    crime: String,
    punishment: requiredString,
    lethality: String,
    otherNamesMentioned: String,
    suspects: [],
    numberSuspects: requiredNumber,
    suspectNames: String,
    suspectRaces: String,
    confession: String,
    suspectNotes: String,
    victims: [],
    victimNumber: String,
    victimNames: String,
    victimGenders: String,
    victimRaces: String,
    victimNotes: String,
    sources: [],
    oldSources: String,
    oldNotes: String,
    summary: String,
});


module.exports = mongoose.model('Trip', tripSchema);