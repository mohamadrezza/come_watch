var cheerio = require('cheerio')
var fs = require('fs')
var req = require('request-promise')
async function crawl() {
    var source = "https://morphee.ninja/videos/S%c3%a9ries/Westworld.S02.COMPLETE.VOSTFR.PROPER.720p.AMZN.WEB-DL.DDP5.1.H.264-exPM5/"
    var data = await req(source)
    var $ = cheerio.load(data)

    $('tr').each(async item => {

        var folder = $('tr').eq(item).find('a').attr('href')
        if (folder != '/videos/S%c3%a9ries/' && folder != undefined && folder != '?C=N;O=D') {
            var moviePage = await req(source + folder)
            var page = cheerio.load(moviePage)
            page('tr').each(async i => {
                var movie = page('tr').eq(i).find('a').attr('href')
                if (movie != undefined && movie != "?C=N;O=D" && movie.includes('.mkv')) {
                    var dlLink = source + folder + movie
                    var name = "Westworld"
                    var link = {
                        "link": dlLink,
                        "quality": "720p",
                        "release": "WEB-DL",
                        "season": "2",
                        "dubbed": "false",
                        "censored": "false",
                        "episode": movie.match(/^S?\d*\.\d+|[-]?\d+/g)[1]
                    }
                    var result = {
                        type: "series",
                        name: name,
                        year: 2016,
                        link: link
                    }
                    fs.appendFileSync('../bin/west2.json', JSON.stringify(result) + ',')
                }

            })

        }
    })
    // req(source, (err, res, body) => {
    //    

    //         if (folder != undefined && folder != '/videos/S%c3%a9ries/' && folder != '?C=N;O=D') {
    //             req(source + folder, (e, response, bodi) => {
    //                 var page = cheerio.load(bodi)
    //                 page('tr').each(i => {
    //                     var movie = page('tr').eq(i).find('a').attr('href')
    //                     console.log(movie)
    //                 })
    //             })


    //         }
    //     })
    // })


}
crawl()