//model for the trip schema
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const requiredString = {type: String, required: true};

//trip
const tripSchema = new Schema({
    caseNum: requiredString,
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
    
    year: null,
    month: null,
    day: null,
    dateNotes: null,
    state: 'California',
    place: null,
    county: null,
    locationNotes: null,
    crowdType: null,
    crowdSize: null,
    open: true,
    authoritiesPresent: null,
    authoritiesNotes: null,
    crime: null,
    punishment: null,
    lethality: null,
    otherNamesMentioned: null,
    suspects: [
        {
            suspectNames: [],
            suspectRace: [],
            suspectGender: null,
            confessionOrSpeech: null,
            confessionNotes: null,
            attendedByClergy: false, 
            suspectNotes: null
        }
    ],
    vitims: [
        {
            victimNames: [],
            victimGender: null,
            victimRace: null,
            victimNotes: null
        }
    ],
    sources: [
        {
            type: null,
            publicationDate: null,
            publicationCity: null,
            publicationDate: null,
            author: null,
            title: null,
            volumeNumber: null,
            pageNumbers: null,
            sourceNotes: null,
            url: null
        }
    ],
    abstract: null,
});


module.exports = mongoose.model('Trip', tripSchema);