var mongoose = require('mongoose');

var regionSchema = mongoose.Schema({
    region : String,
    regionAvg : Number,
    regionAverages : Array,
    type: String,
    robberyAvg : Number,
    sexualAvg : Number,
    domesticAvg : Number,
    murderAvg : Number,
    grievousAvg : Number
});

var region = mongoose.model("Region", regionSchema, "crime");

module.exports = {
    Region : region
};