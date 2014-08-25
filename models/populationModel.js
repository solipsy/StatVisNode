var mongoose = require('mongoose');

var dataSchema = mongoose.Schema({
	date : Date,
	rate : Number
});

var populationSchema = mongoose.Schema({
    nameUpper : String,
    tujci: {
    	data: [dataSchema] 
    } 
});


var population = mongoose.model("Population", populationSchema, "population");


module.exports = {
    Population : population
};