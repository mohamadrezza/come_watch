var mongoose = require ('mongoose')

var ObjectId = mongoose.Schema.Types.ObjectId

var movieSchema =new mongoose.Schema({
    id:ObjectId,
    name:String,
    year:String,
    dubbed:Boolean,
    category:[{type:Object}],
    imdb:String,
    cover:String,
    description:Text,
    link:[{type:Object}],
    quality:[String],
    report:[String]
})
exports.Movie = mongoose.model('Movie',movieSchema)