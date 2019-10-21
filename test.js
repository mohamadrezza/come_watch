const helper = require('./helpers/helpers')
let fs = require('fs')


const Log = require('./models/Log')
const User = require('./models/User')
const mongoose = require('mongoose');
const _ = require('lodash')





return;

mongoose.connect("mongodb://localhost:27017/COM_WATCH", {
    useNewUrlParser: true,
    useUnifiedTopology: true
});
var db = mongoose.connection;
const Movie = require('./models/Movie');
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", async function callback() {


    return false;
    let doneSearches = await Log.find({
        type: "done"
    }).populate('user')

    console.log(doneSearches.length)

    doneSearches = doneSearches.map(done => {
        return {
            name: done.user.first_name + " " + (done.user.last_name || ""),
            value: done.value,
            chatId: done.user.chat_id
        }
    })

    doneSearches = _.chain(doneSearches)
        .groupBy('chatId')
        .map((value, key) => ({
            chatId: key,
            name: value[0].name,
            done: _.chain(value).mapValues('value').toArray().value()
        }))
        .value();


    let moreThan2Search = doneSearches.filter(done => {
        return done.done.length > 2;
    })


    let moreThan1Search = doneSearches.filter(done => {
        return done.done.length > 1;
    })
    let only2Done = doneSearches.filter(done => {
        return done.done.length == 2;
    })


    let only1Done = doneSearches.filter(done => {
        return done.done.length == 1;
    })


    // fs.writeFileSync('./s.json' , JSON.stringify(doneSearches))
    console.log('done=> ' + doneSearches.length)
    console.log('moreThen2=> ' + moreThan2Search.length)
    console.log('moreThen1=> ' + moreThan1Search.length)
    console.log('only2Done=> ' + only2Done.length)
    console.log('only1Done=> ' + only1Done.length)


});