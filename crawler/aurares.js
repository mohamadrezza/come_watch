// var request = require ('request')
var cheerio = require('cheerio')
var request = require('request')
var helper = require('../helpers/helpers')
var source = 'http://moviebuzz.one/Data/Movies/Hollywood/'
var fs = require ('fs')
function crawl() {
    request.get(source, (err, response, body) => {
        if (err) {
            console.log(err)
        }
        var $ = cheerio.load(body)
        $('a').each(item => {
            var page = $('a').eq(item).text()
            if (page !== '../') {
                var movieParent = source + page

                request.get(movieParent, (err, response, body) => {
                    var pageData = cheerio.load(body)
                    pageData('a').each(i => {
                        var movie = pageData('a').eq(i).attr('href')
                        if (movie !== '../') {
                            if (helper.isValidExt(movie)) {
                                var dlLink = movieParent + movie
                                var year = helper.getYearFromMovieName(movie)
                                var name = helper.parseMovieName(movie, year)
                                var quality = helper.getQuality(movie)
                                var release = helper.getRelease(movie)
                                var result = {
                                    name: decodeURI(name),
                                    year: year,
                                    link: {
                                        link: dlLink,
                                        quality: quality,
                                        release: release,
                                        dubbed: helper.isDubbed(movie),
                                        censored: helper.isSansored(movie)
                                    }
                                }
                                fs.appendFileSync('../bin/dhakaftp.json',JSON.stringify(result)+',')
                            }
                        }
                    })
                })



            }

        })
    })

}

crawl()