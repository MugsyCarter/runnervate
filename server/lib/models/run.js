//model for the run schema
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const requiredString = {type: String, required: true};
const requiredNumber = {type: Number, required: true};

const runSchema = new Schema({
    type: requiredString,
    date: Date,
    miles: requiredNumber,
    time: requiredNumber,
    elevation: Number,
    pace: Number,
    speed: Number,
    pain: Number,
    painLocation: String,
    hunger: Number,
    energy: Number,
    wind: Number,
    location: String,
    notes: String,
});

module.exports = mongoose.model('Run', runSchema);