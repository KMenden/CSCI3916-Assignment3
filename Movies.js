var mongoose = require('mongoose');
var Schema = mongoose.Schema;

mongoose.connect("mongodb://Test:supertest@ds255258.mlab.com:55258/kmentest");

// Movie schema
var MovieSchema = new Schema({
    title: { type: String, required: true, index: { unique: true }},
    year: { type: String, required: true },
    genre: { type: String, required: true, enum:['Action','Adventure','Comedy','Fantasy','Horror','Mystery','Thriller','Drama','Western']},
    actors : { type : Array , "default" : [] }
});


// return the model
module.exports = mongoose.model('Movie', MovieSchema);