var mongoose = require ('mongoose')

var ObjectId = mongoose.Schema.Types.ObjectId

var userSchema = =new mongoose.Schema({
    id:ObjectId,
    first_name:String,
    last_name:[{type:Object}],
    report:[String],
    lang:String
})
exports.User = mongoose.model('Movie',userSchema)