var mongoose = require('mongoose');

var debtorsSchema = mongoose.Schema({
	company : String,
	town : String,
	address : String,
	type : String
});

var debtors = mongoose.model("Debtors", debtorsSchema, "tax");

module.exports = {
    Debtors : debtors
};