var mongoose = require ('mongoose')

var ObjectId = mongoose.Schema.Types.ObjectId

var userSchema = new mongoose.Schema({
    id:ObjectId,
    first_name:String,
    last_name:String,
    lang:String,
    chat_id:String
})
var User = mongoose.model('User',userSchema)

module.exports=User