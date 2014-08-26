var mongoose = require('mongoose');

var electionSchema = mongoose.Schema({
	geoType : String,
	unitName : String,
	electionType : String,
	year : {type: Number, index : true},
	turnover : Number,
	data : mongoose.Schema.Types.Mixed,
	shortName : String
});



var election = mongoose.model("Election", electionSchema, "elections");
//var geo = mongoose.model ("Geo", geoSchema, "geo");

module.exports = {
    Election : election
};