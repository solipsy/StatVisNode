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



var region = mongoose.model("Region", regionSchema, "crime");


module.exports = {
    Region : region
};