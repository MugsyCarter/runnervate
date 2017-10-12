//model for the course schema
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const requiredString = {type: String, required: true};
const requiredNumber = {type: Number, required: true};

//periodicTable
const elementSchema = new Schema({
    name: requiredString,
    appearance: String,
    atomic_mass: requiredNumber,
    boil: Number,
    category: String,
    color: String,
    density: Number,
    discovered_by: String,
    melt: Number,
    molar_heat: Number,
    named_by: String,
    number: requiredNumber,
    period: requiredNumber,
    phase: String,
    source: String,
    spectral_img: String,
    summary: String,
    symbol: requiredString,
    xpos: Number,
    ypos: Number,
    shells: [Number]
});


module.exports = mongoose.model('Element', elementSchema);