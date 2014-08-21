var mongoose = require('mongoose');

var regionSchema = mongoose.Schema({
    region : String,
    population : Number,
    regionAvg : Number,
    regionAverages : Array,
    type: String,
    robberyAvg : Number,
    sexualAvg : Number,
    domesticAvg : Number,
    murderAvg : Number,
    grievousAvg : Number,
    grievousYears : Array,
    sexualYears : Array,
    robberyYears : Array
});

var geoSchema = mongoose.Schema ({
    type: String,
    data : mongoose.Schema.Types.Mixed
});

var region = mongoose.model("Region", regionSchema, "crime");
var geo = mongoose.model ("Geo", geoSchema, "geo");

module.exports = {
    Region : region,
    Geo : geo
};