//model for the trip schema
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const requiredString = {type: String, required: true};

//trip
const tripSchema = new Schema({
    name: requiredString,
    type: requiredString,
    description: requiredString,
    startDate: Date,
    endDate: Date,
    mileage: Number,
    startLocation:requiredString,
    endLocation: String,
    people: [],
    fun: Number,
    scenery: Number,
    difficulty: Number,
    overall: Number,
    comments: [],
    photos: [],
    activities: []
});


module.exports = mongoose.model('Trip', tripSchema);