var mongoose = require('mongoose');
var Schema = mongoose.Schema;

mongoose.connect("mongodb://Test:supertest@ds255258.mlab.com:55258/kmentest");

// Review schema
var ReviewSchema = new Schema({
    user: { type: String, required: true},
    movietitle: { type: String, required: true},
    reviewbody: { type: String, required: true },
    rating: { type: Number, required: true, enum:[1,2,3,4,5]}

});


// return the model
module.exports = mongoose.model('Review', ReviewSchema);