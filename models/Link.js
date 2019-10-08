var mongoose = require ('mongoose')

var ObjectId = mongoose.Schema.Types.ObjectId

var linkSchema = =new mongoose.Schema({
    id:ObjectId,
    movie:{ref:'Movie',type:ObjectId}
})
exports.Link = mongoose.model('Link',linkSchema)