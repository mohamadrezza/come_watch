const helper = require('./helpers/helpers')
let fs = require('fs')
<<<<<<< HEAD

//aurares
//batches
//film2serial
//ma_collection
//new_stuff
//shahrdl4
//shahrdl11
//collection
let data = fs.readFileSync('./bin/collection.json');

=======
let data = fs.readFileSync('./crawler/film.json');
>>>>>>> c3ae07162b0311cd001ef15cd79fdc6bde50afc5
console.log(JSON.parse(data).length)
let films = JSON.parse(data);
let movieController = require('./controller/MovieController')
const mongoose = require('mongoose');
async function asyncForEach(array, callback) {
    for (let index = 0; index < array.length; index++) {
      await callback(array[index], index, array);
    }
}
mongoose.connect("mongodb://localhost:27017/COM_WATCH", {
  useNewUrlParser: true,
  useUnifiedTopology: true
});
var db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", async function callback() {
  console.log("connected to com_watch database");
<<<<<<< HEAD

    asyncForEach(films , async film => {
            console.log('before')
        
            await movieController.create(film)
        
            console.log('after')
    } )

    


//   crawl();
=======
    asyncForEach(films , async film => {
            await movieController.create(film)
    } )
>>>>>>> c3ae07162b0311cd001ef15cd79fdc6bde50afc5
});



