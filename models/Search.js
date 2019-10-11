var mongoose = require ('mongoose')

var ObjectId = mongoose.Schema.Types.ObjectId

var searchSchema = new mongoose.Schema({
    id:ObjectId,
    value:String,
    user:{ref:'User',type:ObjectId}
})
var Search= mongoose.model('Search',searchSchema)

module.exports = Search;
