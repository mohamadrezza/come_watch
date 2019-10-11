var mongoose = require ('mongoose')

var ObjectId = mongoose.Schema.Types.ObjectId

var movieSchema =new mongoose.Schema({
    id:ObjectId,
    name:String,
    year:String,
    category:[{type:Object}],
    imdb:String,
    cover:String,
    description:String,
    link:[{type:Object}],
})
exports.Movie = mongoose.model('Movie',movieSchema)