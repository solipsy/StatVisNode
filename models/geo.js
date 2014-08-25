var mongoose = require('mongoose');

var geoSchema = mongoose.Schema ({
    type: String,
    subtype: String,
    data : mongoose.Schema.Types.Mixed
});

var featureSchema = mongoose.Schema({
    type : String,
    properties: {
        nameUpper : String,
        nameLower : String
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
var detailedgeo = mongoose.model ("DetGeo", geoSchema, "detailedgeo");

module.exports = {
    Geo : geo,
    DetGeo : detailedgeo
};