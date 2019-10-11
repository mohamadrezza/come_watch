const mongoose = require("mongoose");

mongoose.connect("mongodb://localhost:27017/COM_WATCH", {
  useNewUrlParser: true,
  useUnifiedTopology: true
});
var db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));

let connected = new Promise(function(resolve, reject) {
  db.once("open", function callback() {
    console.log("com_watch database");
    resolve();
  });
});