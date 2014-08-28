var mongoose = require('mongoose');

var geoSchema = mongoose.Schema ({
    type: String,
    subtype: String,
    data : mongoose.Schema.Types.Mixed
});

var featureSchema = mongoose.Schema({
    type : String,
    properties: mongoose.Schema.Types.Mixed,
    geometry : mongoose.Schema.Types.Mixed
});

var roadSchema = mongoose.Schema({
    type : String,
    properties: {
        type : String,
        FRC : Number,
        nameUpper : String
    },
    geometry : {
        type : String,
        coordinates : mongoose.Schema.Types.Mixed
    }
});

var detailedSchema = mongoose.Schema({
    nameUpper: String,
    nameLower: String,
    data: [featureSchema]

});

var geo = mongoose.model ("Geo", geoSchema, "geo");
var roads = mongoose.model ("Roads", featureSchema, "detgeo");

module.exports = {
    Geo : geo,
    Roads : roads
};