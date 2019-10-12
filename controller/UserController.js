var User = require('../models/User')

exports.create = async (req, res) => {
    try {
        var msg = {
            first_name: 'mammad',
            last_name: 'shabooni',
            data: 'some stuff'
        }
       var user =await User.findOne({tel_id:'5454854'})
       if(!user){
        await User.create({
            first_name: msg.first_name,
            last_name: msg.last_name,
            tel_id: 5454854
        })
        console.log('user created')
       } 
      res.send('done')
    } catch (e) {
        console.log(e)
        res.status(500).send(e)
    }

}