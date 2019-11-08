var cheerio = require('cheerio')
//
var rp = require('request-promise')
var fs = require('fs')
var helper = require('../helpers/helpers')

var source = 'http://dhakaftp.com/Data/Disk4/Top-250-IMDB/'

async function crawl() {
    var data = await rp(source)
    var $ = cheerio.load(data)
    $('a').each(async item => {
        var link = $('a').eq(item).attr('href')
        if (link != '../') {
            var movieDir = source + link
            var movies = await rp(movieDir)
            var imdb = cheerio.load(movies)
            imdb('a').each(async i => {
                try {
                    var movie = imdb('a').eq(i).attr('href')
                    if (helper.isValidExt(movie)) {
                        var name = imdb('a').eq(i).text()
                        var dlLink = movieDir + movie
                        var file = await rp.head(dlLink)
                        var year = helper.getYearFromMovieName(movie)
                        var parsedName = helper.parseMovieName(name, year)

                        var size = file['content-length']
                        var result = {
                            year: year,
                            name: parsedName,
                            type: 'movie',
                            category: 'top250',
                            link: {
                                link: dlLink,
                                release: helper.getRelease(movie),
                                quality: helper.getQuality(movie),
                                size: helper.bytesToSize(size),
                                dubbed: false,
                                censored: false,
                            }
                        }
                        fs.appendFileSync('./series.json', JSON.stringify(result) + ',')

                    }



                } catch (e) {
                    console.log(e)
                }
            })



        }
    })
}

crawl()
console.warn('start')