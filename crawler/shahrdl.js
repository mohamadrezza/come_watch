//finland server
var cheerio = require('cheerio')
var helper = require('../helpers/helpers')
var rp = require('request-promise')

var movieController = require('./../controller/MovieController')


const mongoose = require('mongoose');


mongoose.connect("mongodb://localhost:27017/COM_WATCH", {
  useNewUrlParser: true,
  useUnifiedTopology: true
});
var db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", function callback() {
    console.log("connected to com_watch database");
});


// another loop ?! kiss my ass ... 
var sources = [
    // 'http://dl11.difid.ir/0-9/',
    // 'http://dl11.difid.ir/B/',
    // 'http://dl11.difid.ir/C/',
    // 'http://dl11.difid.ir/D/',
    // 'http://dl11.difid.ir/E/',
    // 'http://dl11.difid.ir/F/',
    // 'http://dl11.difid.ir/G/',
    // 'http://dl11.difid.ir/H/',
    // 'http://dl11.difid.ir/I/',
    // 'http://dl11.difid.ir/J/',
    // 'http://dl11.difid.ir/K/',
    'http://dl11.difid.ir/L/',
    // 'http://dl11.difid.ir/M/',
    // 'http://dl11.difid.ir/N/',
    // 'http://dl11.difid.ir/O/',
    // 'http://dl11.difid.ir/P/',
    // 'http://dl11.difid.ir/Q/',
    // 'http://dl11.difid.ir/R/',
    // 'http://dl11.difid.ir/S/',
    // 'http://dl11.difid.ir/T/',
    // 'http://dl11.difid.ir/U/',
    // 'http://dl11.difid.ir/V/',
    // 'http://dl11.difid.ir/W/',
    // 'http://dl11.difid.ir/X/',
    // 'http://dl11.difid.ir/Y/',
    // 'http://dl11.difid.ir/Z/',
]
//there is some extra route and web.configs and i don't want loop anymore :D
async function job() {
    try {
        sources.forEach(async source => {
            var data = await rp(source)
            var htmlPage = cheerio.load(data)
            htmlPage('a').each(async i => {
                try {
                    var yearLink = htmlPage('a').eq(i).text()
                    if (yearLink != '[To Parent Directory]') {
                        var link = await rp(source + yearLink)
                        var page = cheerio.load(link)
                        page('a').each(async item => {
                            try {
                                var movie = page('a').eq(item).text()
                                let year = helper.getYearFromMovieName(movie);
                                let parsedName = helper.parseMovieName(movie, year)
                                var dlLink = source + yearLink + '/' + movie
                                var file = await rp(dlLink, {
                                    method: 'HEAD'
                                })

                                if (movie != '[To Parent Directory]') {
                                    var result = {
                                        name: parsedName,
                                        year: year,
                                        quality: helper.getQuality(movie),
                                        release: helper.getRelease(movie),
                                        dubbed: helper.isDubbed(movie),
                                        link: dlLink,
                                        size:helper.bytesToSize(file["content-length"])
                                    }

                                }
                                // a lot of movies !!
                                console.table(result)
                            } catch (e) {
                                console.log(e.message)
                            }
                        })
                    }
                } catch (e) {
                    console.log(e.message)
                }
            })
        })

    } catch (e) {
        console.log(e.message)
    }
}
job()