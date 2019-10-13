let fs = require('fs')


let data = fs.readFileSync('./crawler/film.json');

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

    asyncForEach(films , async film => {
            // console.log('before')
        
            await movieController.create(film)
        
            // console.log('after')
    } )

    


//   crawl();
});



